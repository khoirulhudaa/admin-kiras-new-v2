// import { APP_CONFIG } from '@/core/configs';
// import { Button, Input, Label, VokadashHead } from '@/core/libs';
// import { InputSecure, useAlert } from '@/features/_global';
// import { FormEventHandler, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// export const LoginPage = () => {
//   const navigate = useNavigate();
//   const auth = useAuth();
//   const alert = useAlert();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const submit: FormEventHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await auth.login({ email, password });
//       const token = res.data.token;

//       if (token) {
//         localStorage.setItem('token', token);
//         alert.success('Login berhasil!');
//         setTimeout(() => {
//           navigate('/', { replace: true });
//         }, 300);
//       } else {
//         alert.error('Gagal mendapatkan token dari server');
//       }
//     } catch (err: any) {
//       const msg = err.response?.data?.message || 'Email atau password salah';
//       alert.error(msg);
//     }
//   };

//   return (
//     <div className="relative">
//       <form onSubmit={submit} className="space-y-6">
//         <VokadashHead>
//           <title>{`Login | ${APP_CONFIG.appName}`}</title>
//         </VokadashHead>

//         <div className="space-y-6">
//           <div className="space-y-3">
//             <Label className="text-slate-300 text-[13px] font-medium ml-1">Akun Email</Label>
//             <Input
//               type="email"
//               placeholder="name@example.com"
//               autoComplete="username"
//               required
//               value={email}
//               onChange={({ target: { value } }) => setEmail(value)}
//               className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
//             />
//           </div>

//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <Label className="text-slate-300 text-[13px] font-medium ml-1">Kata Sandi</Label>
//               <Link to="/auth/forget-password" 
//                     className="text-[12px] text-blue-500 hover:text-blue-400 transition-colors">
//                 Lupa kata sandi?
//               </Link>
//             </div>
//             <InputSecure
//               required
//               autoComplete="current-password"
//               value={password}
//               onChange={({ target: { value } }) => setPassword(value)}
//               placeholder="••••••••"
//               className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
//             />
//           </div>
//         </div>

//         <Button 
//           type="submit" 
//           disabled={auth.isLoading} 
//           className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/10"
//         >
//           {auth.isLoading ? 'Memproses...' : 'Masuk'}
//         </Button>

//         <div className="text-center pt-2">
//           <p className="text-[13px] text-slate-500">
//             Buat akun baru?{' '}
//             <Link to="/schools/register" className="text-blue-400 font-medium transition-colors">
//               klik sekarang
//             </Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };


import { APP_CONFIG } from '@/core/configs';
import { Button, Input, Label, VokadashHead } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import tambahan untuk QR & Socket
import { Loader2, Mail, Monitor, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

// Pastikan URL socket sesuai dengan backend Anda
export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();
  
  // State Management
  const [loginMethod, setLoginMethod] = useState<'manual' | 'qr'>('manual');
  const [sessionId] = useState(uuidv4());
  const [isQrAuthenticated, setIsQrAuthenticated] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const socketRef = useRef<any>(null); // ← socket di ref

   useEffect(() => {
    if (loginMethod !== 'qr') return;

    // Buat socket baru setiap masuk mode QR
    const socket = io("https://be-school.kiraproject.id", {
      transports: ["websocket"],
      // autoConnect: false,
    });
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('[connected] join room:', sessionId);
      socket.emit('join-login-room', sessionId);
    };

    const handleLoginSuccess = (data: any) => {
      console.log('[login-success]', data);
      setIsQrAuthenticated(true);
      localStorage.setItem('token', data.token);
      alert.success('Akses Diberikan melalui QR!');
      socket.disconnect();
      setTimeout(() => navigate('/', { replace: true }), 1000);
    };

    socket.on('connect', handleConnect);
    socket.on('login-success', handleLoginSuccess);
    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('login-success', handleLoginSuccess);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loginMethod]); // ← hanya loginMethod sebagai dependency

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login({ email, password });
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        alert.success('Login berhasil!');
        setTimeout(() => navigate('/', { replace: true }), 300);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Email atau password salah';
      alert.error(msg);
    }
  };

  // Effect untuk Socket QR Login
  // useEffect(() => {
  //   if (loginMethod === 'qr') {
  //     // Bergabung ke room berdasarkan sessionId unik
  //     socket.emit('join-login-room', sessionId);

  //     const handleLoginSuccess = (data: any) => {
  //       console.log('data login', data)
  //       setIsQrAuthenticated(true);
  //       localStorage.setItem('token', data.token);
  //       alert.success('Akses Diberikan melalui QR!');
        
  //       // Redirect setelah delay singkat
  //       setTimeout(() => {
  //         navigate('/', { replace: true });
  //       }, 1000);
  //     };

  //     socket.on('login-success', handleLoginSuccess);

  //     return () => {
  //       socket.off('login-success', handleLoginSuccess);
  //     };
  //   }
  // }, [loginMethod, sessionId, navigate, alert]);

  // const submit: FormEventHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await auth.login({ email, password });
  //     const token = res.data.token;

  //     if (token) {
  //       localStorage.setItem('token', token);
  //       alert.success('Login berhasil!');
  //       setTimeout(() => {
  //         navigate('/', { replace: true });
  //       }, 300);
  //     }
  //   } catch (err: any) {
  //     const msg = err.response?.data?.message || 'Email atau password salah';
  //     alert.error(msg);
  //   }
  // };

  return (
    <div className="relative space-y-6">
      <VokadashHead>
        <title>{`Login | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>

      {/* TABS SWITCHER */}
      <div className="flex bg-white/[0.05] p-1 rounded-xl border border-white/10 shadow-inner">
        <button 
          onClick={() => setLoginMethod('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-bold transition-all ${loginMethod === 'manual' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <Mail size={14} /> EMAIL
        </button>
        <button 
          onClick={() => setLoginMethod('qr')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-bold transition-all ${loginMethod === 'qr' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <QrCode size={14} /> QR CODE
        </button>
      </div>

      {/* CONTENT AREA */}
      {loginMethod === 'manual' ? (
        <form onSubmit={submit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-slate-300 text-[13px] font-medium ml-1">Akun Email</Label>
              <Input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
                className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-slate-300 text-[13px] font-medium ml-1">Kata Sandi</Label>
                <Link to="/auth/forget-password" 
                      className="text-[12px] text-blue-500 hover:text-blue-400 transition-colors">
                  Lupa kata sandi?
                </Link>
              </div>
              <InputSecure
                required
                value={password}
                onChange={({ target: { value } }) => setPassword(value)}
                placeholder="••••••••"
                className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={auth.isLoading} 
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/10"
          >
            {auth.isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Masuk'}
          </Button>
        </form>
      ) : (
        /* QR CODE SECTION */
        <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-in zoom-in-95 duration-500">
          <div className="relative p-3 bg-white rounded-2xl shadow-2xl border border-white/20">
            <div className="w-48 h-48">
              <QRCodeCanvas
                value={sessionId}
                size={500}
                style={{ width: '100%', height: '100%' }}
                level="H"
                imageSettings={{ src: "/logo-icon.png", height: 40, width: 40, excavate: true }}
              />
            </div>
            
            {isQrAuthenticated && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <Monitor size={28} />
                </div>
                <p className="text-[11px] font-black text-green-600 tracking-widest uppercase">Terkoneksi!</p>
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Siap untuk Scan</span>
            </div>
            {/* <p className="text-[12px] text-slate-400 max-w-[250px] leading-relaxed">
              Buka aplikasi <span className="text-white">Presensi PRO</span> dan scan kode di atas untuk masuk otomatis.
            </p> */}
          </div>
        </div>
      )}

      {
        loginMethod === 'manual' && (
          <div className="text-center pt-2">
            <p className="text-[13px] text-slate-500">
              Buat akun baru?{' '}
              <Link to="/schools/register" className="text-blue-400 font-medium transition-colors">
                klik sekarang
              </Link>
            </p>
          </div>
        )
      }
    </div>
  );
};