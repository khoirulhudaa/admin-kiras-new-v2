import { Button, cn, lang } from '@/core/libs';
import { useClassroom } from '@/features/classroom';
import { useCourse } from '@/features/course';
import { fetchCalendarEvents } from '@/features/events';
import { useProfile } from '@/features/profile';
import { useSchool } from '@/features/schools';
import { useBiodata } from '@/features/user';
import { Loader2, Maximize, Menu, MessageSquare, Mic, Minimize, Send, X } from 'lucide-react';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { LangToggle } from '../lang-toggle';
import { ThemeToggle } from '../theme-toggle';
import { Sidebar } from './sidebar';
import { SidebarProps } from './sidebar/types';
import { UserMenu, UserMenuProps } from './usermenu';

export interface DashboardLayoutProps extends PropsWithChildren {
  menus: SidebarProps['menus'];
  usermenus: UserMenuProps['menus'];
  sidebarClassName?: string;
  headerClassName?: string;
}


const Chatbot = ({ classroomData, schoolData, studentData, studentDetailData, courseData, profileData, setCreateClassRoom, classRoom, events, show }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState({});
  const chatEndRef = useRef(null);

  // Inisialisasi Web Speech API untuk input suara
  const recognition = useRef(null);
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.lang = 'id-ID';
      recognition.current.continuous = false;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.current.onend = () => setIsListening(false);
    }
  }, []);

  // Scroll ke pesan terbaru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  // Logika untuk memproses pertanyaan dengan kata kunci yang diperluas
  const processQuery = async (message) => {
    const lowerMessage = message.toLowerCase();
    let newContext = { ...context };

    console.log('Processing query:', lowerMessage);
    console.log('schoolData:', schoolData);
    console.log('studentData:', studentData);

    // Deteksi konteks sekolah dengan pengecekan lebih aman
    let schoolMatch = null;
    if (Array.isArray(schoolData) && schoolData[0]?.namaSekolah) {
      const namaSekolah = schoolData[0].namaSekolah;
      if (typeof namaSekolah === 'string' && lowerMessage.includes(namaSekolah.toLowerCase())) {
        schoolMatch = schoolData[0];
        newContext.school = namaSekolah;
      }
    }

    // Deteksi nama siswa, NIS, atau NISN
    let nameMatch = null;
    let nisMatch = null;
    let nisnMatch = null;
    if (Array.isArray(studentData)) {
      // Ekstrak bagian setelah kata kunci siswa
      const studentQueryMatch = lowerMessage.match(/(?:detail|info|profil|biodata|data|tentang|siapa)\s+siswa\s+(.+)/i);
      const studentQuery = studentQueryMatch ? studentQueryMatch[1].trim() : null;

      if (studentQuery) {
        // Cek apakah studentQuery adalah angka (NIS atau NISN)
        const isNumber = /^\d+$/.test(studentQuery);
        if (isNumber) {
          nisMatch = studentData.find((s) => s?.user?.nis && typeof s?.user?.nis === 'string' && s?.user?.nis === studentQuery);
          nisnMatch = studentData.find((s) => s?.user?.nisn && typeof s?.user?.nisn === 'string' && s?.user?.nisn === studentQuery);
        } else {
          // Cek apakah studentQuery adalah nama
          nameMatch = studentData.find((s) => s.name && typeof s.name === 'string' && lowerMessage.includes(s.name.toLowerCase()));
        }
      }

      // Cek eksplisit untuk "NIS" atau "NISN"
      nisMatch = nisMatch || studentData.find((s) => s?.user?.nis && typeof s?.user?.nis === 'string' && lowerMessage.includes(s?.user?.nis));
      nisnMatch = nisnMatch || studentData.find((s) => s?.user?.nisn && typeof s?.user?.nisn === 'string' && lowerMessage.includes(s?.user?.nisn));
    }

    if (nameMatch) {
      newContext.student = nameMatch.name;
      newContext.nis = nameMatch.nis;
    } else if (nisMatch) {
      newContext.student = nisMatch.name;
      newContext.nis = nisMatch.nis;
    } else if (nisnMatch) {
      newContext.student = nisnMatch.name;
      newContext.nis = nisnMatch.nis;
      newContext.nisn = nisnMatch.nisn;
    }

    try {
      // Kata kunci untuk kelas
      if (
        lowerMessage.includes('berapa kelas') ||
        lowerMessage.includes('jumlah kelas') ||
        lowerMessage.includes('daftar kelas') ||
        lowerMessage.includes('list of classes') ||
        lowerMessage.includes('List of classes') ||
        lowerMessage.includes('kelas apa saja') ||
        lowerMessage.includes('list kelas') ||
        lowerMessage.includes('kelas di') ||
        lowerMessage.includes('data kelas') ||
        lowerMessage.includes('info kelas') ||
        lowerMessage.includes('semua kelas')
      ) {
        console.log('kelassss', classroomData)
        console.log('newContext', newContext)
        if (!Array.isArray(classroomData)) {
          return {
            reply: 'Data kelas belum tersedia. Silakan coba lagi nanti.',
            data: null,
            context: newContext,
            action: null,
          };
        }
        const filteredClasses = newContext.school
          ? classroomData.filter((c) => c.level && c.level === newContext.school)
          : classroomData;
          console.log('classroomData filterrr', filteredClasses)
        const reply = filteredClasses?.length
          ? `Ada ${filteredClasses.length} kelas.`
          : `Tidak ada data kelas.`;
        return { reply, data: filteredClasses, context: newContext, action: null };
      }
      // Kata kunci untuk membuat kelas
      else if (
        lowerMessage.includes('buat kelas') ||
        lowerMessage.includes('tambah kelas') ||
        lowerMessage.includes('create a class') ||
        lowerMessage.includes('Create a class') ||
        lowerMessage.includes('kelas baru') ||
        lowerMessage.includes('bikin kelas') ||
        lowerMessage.includes('create class')
      ) {
        return {
          reply: 'Apakah Anda ingin membuka form untuk membuat kelas baru?',
          data: null,
          context: newContext,
          action: { label: 'Buat Kelas', onClick: () => setCreateClassRoom(!classRoom) },
        };
      }
      else if (
        lowerMessage.includes('daftar acara') ||
        lowerMessage.includes('list acara') ||
        lowerMessage.includes('list of events') ||
        lowerMessage.includes('List of events') ||
        lowerMessage.includes('acara sekolah') ||
        lowerMessage.includes('event sekolah') ||
        lowerMessage.includes('event') ||
        lowerMessage.includes('acara')
      ) {
        if (!Array.isArray(events) || events.length === 0) {
          return {
            reply: 'Data acara belum tersedia. Silakan coba lagi nanti.',
            data: null,
            context: newContext,
            action: null,
          };
        }

        const formattedEvents = events.map((event) => ({
          note: event.note || '-',
          startTime: event.startTime ? new Date(event.startTime).toLocaleString('id-ID') : '-',
          endTime: event.endTime ? new Date(event.endTime).toLocaleString('id-ID') : '-',
        }));

        const reply = `Berikut acara yang tersedia (${formattedEvents.length} acara):`;
        return {
          reply,
          data: formattedEvents,
          context: newContext,
          action: null,
        };
      }
      // Kata kunci untuk detail siswa
      else if (
        lowerMessage.includes('detail siswa') ||
        lowerMessage.includes('info siswa') ||
        lowerMessage.includes('Student info') ||
        lowerMessage.includes('student info') ||
        lowerMessage.includes('profil siswa') ||
        lowerMessage.includes('biodata siswa') ||
        lowerMessage.includes('data siswa') ||
        lowerMessage.includes('tentang siswa') ||
        lowerMessage.includes('siapa') ||
        lowerMessage.includes('siswa')
      ) {
        const student = nameMatch || nisMatch || nisnMatch;
        console.log('student', student)
        if (!student) {
          return {
            reply: 'Siswa tidak ditemukan. Silakan sebutkan nama, NIS, atau NISN yang valid.',
            data: null,
            context: newContext,
            action: null,
          };
        }
        const studentDetail = Array.isArray(studentDetailData?.data) && studentDetailData?.data?.find((d) => d.id === student.id);
        console.log('info siswa 751', studentDetail)
        const reply = `Detail siswa:\nNama: ${studentDetail.user?.name || '-'}\nNIS: ${studentDetail.user?.nis || '-'}\nNISN: ${studentDetail.user?.nisn || '-'}\nEmail: ${studentDetail.user?.email || '-'}\nKelas: ${studentDetail.kelas?.namaKelas || '-'}`;
        return { reply, data: [studentDetail], context: newContext, action: null };
      }
      // Kata kunci untuk daftar siswa
      else if (
        lowerMessage.includes('daftar siswa') ||
        lowerMessage.includes('list siswa') ||
        lowerMessage.includes('berapa siswa') ||
        lowerMessage.includes('jumlah siswa') ||
        lowerMessage.includes('data siswa') ||
        lowerMessage.includes('semua siswa') ||
        lowerMessage.includes('murid')
      ) {
        if (!Array.isArray(studentData)) {
          return {
            reply: 'Data siswa belum tersedia. Silakan coba lagi nanti.',
            data: null,
            context: newContext,
            action: null,
          };
        }
        const filteredStudents = newContext.school
          ? studentData.filter((s) => s.sekolahId && s.sekolahId === schoolData?.[0]?.id)
          : studentData;
        const reply = filteredStudents?.length
          ? `Ada ${filteredStudents.length} siswa di ${newContext.school || 'semua sekolah'}.`
          : `Tidak ada data siswa untuk ${newContext.school || 'semua sekolah'}.`;
        return { reply, data: filteredStudents, context: newContext, action: null };
      }
      // Kata kunci untuk mata pelajaran
      else if (
        lowerMessage.includes('mata pelajaran') ||
        lowerMessage.includes('daftar pelajaran') ||
        lowerMessage.includes('daftar mata pelajaran') ||
        lowerMessage.includes('list of subjects') ||
        lowerMessage.includes('list of subject') ||
        lowerMessage.includes('List of subjects') ||
        lowerMessage.includes('List of subject') ||
        lowerMessage.includes('list mata pelajaran') ||
        lowerMessage.includes('pelajaran apa saja') ||
        lowerMessage.includes('mapel') ||
        lowerMessage.includes('mata kuliah') ||
        lowerMessage.includes('pelajaran di') ||
        lowerMessage.includes('kursus')
      ) {
        console.log('mapel', courseData)
        if (!Array.isArray(courseData)) {
          return {
            reply: 'Data mata pelajaran belum tersedia. Silakan coba lagi nanti.',
            data: null,
            context: newContext,
            action: null,
          };
        }
        const reply = courseData?.length
          ? `Ada ${courseData.length} mata pelajaran di ${newContext.school || 'sekolah'}.`
          : `Tidak ada data mata pelajaran untuk ${newContext.school || 'sekolah'}.`;
        return { reply, data: courseData, context: newContext, action: null };
      }
      // Kata kunci untuk profil pengguna
      else if (
        lowerMessage.includes('profil saya') ||
        lowerMessage.includes('info akun') ||
        lowerMessage.includes('data akun') ||
        lowerMessage.includes('profile info') ||
        lowerMessage.includes('Profile info') ||
        lowerMessage.includes('biodata saya') ||
        lowerMessage.includes('tentang saya') ||
        lowerMessage.includes('akun saya') ||
        lowerMessage.includes('profile')
      ) {
        console.log('akun', profileData)
        if (!profileData?.user) {
          return {
            reply: 'Data profil belum tersedia. Silakan coba lagi nanti.',
            data: null,
            context: newContext,
            action: null,
          };
        }
        const reply = `Profil Anda: Nama ${profileData.user.name || '-'}, Email ${profileData.user.email || '-'}, Role ${profileData.user.role || '-'}, Sekolah ${profileData.user.sekolah?.namaSekolah || '-'}.`;
        return { reply, data: [profileData.user], context: newContext, action: null };
      }
      // Default response
      return {
        reply: 'Maaf, saya tidak mengerti. Coba tanyakan tentang kelas, siswa, mata pelajaran, atau profil Anda.',
        data: null,
        context: newContext,
        action: null,
      };
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        reply: 'Terjadi kesalahan saat memproses pertanyaan. Silakan coba lagi.',
        data: null,
        context: newContext,
        action: null,
      };
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    try {
      // Proses pertanyaan
      const { reply, data, context: newContext, action } = await processQuery(input);
      const botMessage = { sender: 'bot', text: reply, data, action };
      setMessages((prev) => [...prev, botMessage]);
      setContext(newContext);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage = { sender: 'bot', text: 'Gagal memproses pertanyaan. Silakan coba lagi.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const renderData = (data) => {
    if (!data || !data.length) return null;
    console.log('hasil data cek di sini', data);

    // Menentukan kolom berdasarkan jenis data
    let headers = [];
    let rows = [];
    if (data[0]?.user?.nis) {
      // Data siswa
      headers = ['Nama', 'NIS', 'nis', 'Email', 'NoTlp', 'Kelas'];
      rows = data.map((item) => [
        item?.user?.name || '-',
        item?.user?.nis || '-',
        item?.user?.nisn || '-',
        item?.user?.email || '-',
        item?.user?.noTlp || '0',
        item?.kelas?.namaKelas || '-',
      ]);
      console.log('hai', rows);
    } else if (data[0]?.level) {
      // Data mata pelajaran
      headers = ['Nama kelas', 'Tingkat'];
      rows = data.map((item) => [item.namaKelas || '-', item.level || '-']);
    } else if (data[0]?.namaMataPelajaran) {
      // Data mata pelajaran
      headers = ['Mata Pelajaran'];
      rows = data.map((item) => [item.namaMataPelajaran]);
    } else if (data[0]?.role) {
      // Data profil
      headers = ['Nama', 'Email', 'Role'];
      rows = data.map((item) => [item.name || '-', item.email || '-', item.role || '-']);
    } else if (data[0]?.note && data[0]?.startTime && data[0]?.endTime) {
      // Data event / acara
      headers = ['Judul', 'Mulai', 'Berakhir'];
      rows = data.map((item) => [
        item.note || '-',
        item.startTime || '-',
        item.endTime || '-',
      ]);
    }

    return (
      <div className="mt-2 p-2 bg-gray-100 rounded space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="last:border-b-0 px-3">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="border-b border-black/20 pt-4 pb-5">
                {headers[cellIndex]}: {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`z-[555] fixed bottom-28 pb-6 ${show ? 'right-[4%]' : 'right-[-100%]'} ease duration-500 w-[28%] bg-white shadow-xl rounded-lg p-4 flex flex-col max-h-[75vh]`}>
      <div className="w-full relative top-0 left-0 p-3 border-b border-black/10 rounded-sm mb-4">
        <p className="text-slate-500"><span className='font-bold text-black'>{lang.text('commandWord')}:</span> <br /> {lang.text('ListOfSubjects')} | {lang.text('ProfileInfo')} | {lang.text('StudentInfo')} | <br /> {lang.text('ListOfClasses')} | {lang.text('CreateClass')} | {lang.text('ListOfEvents')}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block px-0 py-3 rounded-lg ${
                msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              <p className="font-bold mx-5">
                {msg.text}
              </p>
              {msg.data && renderData(msg.data)}
              {msg.action && (
                <button
                  onClick={msg.action.onClick}
                  className="mt-2 bg-blue-500 text-white ml-5 px-3 py-2 rounded text-sm"
                >
                  {msg.action.label}
                </button>
              )}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-center my-2">
            <Loader2 className="animate-spin inline-block" size={20} />
            <span className="ml-2 text-gray-500">Memproses...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="flex items-center pt-4">
        <button
          onClick={startListening}
          className={`p-2 mr-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-gray-200 text-black border border-black/50'}`}
          disabled={!recognition.current || isLoading}
        >
          <Mic size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
          className="flex-1 border rounded p-2 text-black"
          placeholder="Tanya tentang kelas, siswa, pelajaran, atau perpustakaan..."
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};


export const DashboardLayout = React.memo(({ menus = [], usermenus, children, ...props }: DashboardLayoutProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(false); // Ubah default ke true agar sidebar terlihat saat pertama load
  const [minimize, setMinimize] = useState(false); // Ubah default ke true agar sidebar terlihat saat pertama load
  const [visible, setVisible] = useState(true); // Ubah default ke true agar sidebar terlihat saat pertama load
  const profile = useProfile();
  const resource = useClassroom();
  const school = useSchool();
  const student = useBiodata();
  const course = useCourse();
  const [classRoom, setCreateClassRoom] = useState(false);
  const [events, setEvents] = useState([]);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

   const loadEvents = async () => {
      try {
        const response = await fetchCalendarEvents(); // Ambil semua event dari API
        console.log('reponse', response?.data)
        setEvents(response?.data)
        if (!response || !response.data) {
          console.error("❌ Error: Data tidak ditemukan dalam response API.");
          return;
        }
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      } 
  };

  useEffect(() => {
    loadEvents()
  }, [])

  const filteredMenus = menus.map((data) => {
    if(profile?.user?.role === 'superAdmin' && data?.title === 'Manajemen Perpustakaan') {
      return false;
    }
    if (data.items) {
      const filteredItems = data.items.filter(item => {
        if (profile?.user?.role === 'superAdmin' && (item.title === 'Acara' || item.title === 'Kelulusan')) {
          return false;
        }
        return true;
      });

      return filteredItems.length > 0
        ? { ...data, items: filteredItems }
        : null;
    }
    return data;
  }).filter(Boolean);

  return (
    <>
          {/* <div className="dashboard-layout bg-gradient-to-b from-gray-50 to-gray-50 dark:from-gray-950 dark:to-gray-950 grid min-h-[100svh] w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]"></div> */}
      <div className="dashboard-layout grid min-h-[100svh] w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
        {/* <SidebarContext.Provider
          value={{
            visible: sidebarVisible,
            setVisible: () => setSidebarVisible((v) => !v),
          }}
        >
        </SidebarContext.Provider> */}
          <Sidebar.Default 
            menus={filteredMenus}
            className={props.sidebarClassName}
            visible={visible}
            setVisible={setVisible}
            minimize={minimize}
          />
          <div className="sidebar-content flex flex-col overflow-hidden">
            <header
              className={cn(
                `sidebar-header flex h-14 items-center gap-2 border-b bg-[#070a11] ${visible ? 'px-10' : 'px-0 md:px-9'} lg:h-[60px]`,
                props.headerClassName,
              )}
            >
              <div className="relative z-[99] border border-white/10 overflow-hidden hover:border-white/ rounded-full">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {setVisible(!visible), setMinimize(!minimize)}}
                  className="w-max hidden md:flex items-center px-4 overflow-hidden"
                  title={visible ? "Hide Sidebar" : "Show Sidebar"}
                >
                  {visible ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  <p>{visible ? "Hide Sidebar" : "Show Sidebar"}</p>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarVisible((v) => !v)}
                className="hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
              <Sidebar.Sheet className={props.sidebarClassName} menus={filteredMenus} />
              <div className="w-full flex-1">
              </div>
              <ThemeToggle />
              <LangToggle />
              <UserMenu menus={usermenus} />
            </header>
            <div className="sidebar-layout-main md:px-4 max-h-svh overflow-y-auto flex flex-1 flex-col gap-4 pb-10 bg-[#0D121E]">
              <div className="bg-[#0D121E] gap-4 flex-1 flex flex-col py-4 px-3 lg:gap-6 lg:py-6">
                {children}


                {/* Tombol toggle untuk chatbot */}
                {
                  profile?.user?.role !== 'Superadmin' && (
                    <>
                      <button
                        onClick={() => setIsChatbotVisible((prev) => !prev)}
                        className="fixed w-16 h-16 border border-white z-[22] flex items-center justify-center bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
                        aria-label={isChatbotVisible ? "Hide Chatbot" : "Show Chatbot"}
                      >
                        {isChatbotVisible ? <X size={40} /> : <MessageSquare size={40} />}
                      </button>
        
                      <Chatbot
                        classroomData={resource.data}
                        schoolData={school.data}
                        studentData={student.data}
                        studentDetailData={student}
                        courseData={course.data}
                        profileData={profile}
                        setCreateClassRoom={setCreateClassRoom}
                        classRoom={classRoom}
                        events={events}
                        show={isChatbotVisible}
                      />
                    </>
                  )
                }
              </div>
            </div>
          </div>
      </div>
    </>
  );
});

DashboardLayout.displayName = 'DashboardLayout';