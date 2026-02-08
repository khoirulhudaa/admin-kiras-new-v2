// import { APP_CONFIG } from '@/core/configs';
// import { Button, Input, Label, VokadashHead } from '@/core/libs';
// import { InputSecure, useAlert } from '@/features/_global';
// import { FormEventHandler, useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks';

// export const LoginPage = () => {
//   const navigate = useNavigate();
//   const auth = useAuth();
//   const alert = useAlert();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [publicIp, setPublicIp] = useState<string | null>(null);
//   const [showConsentModal, setShowConsentModal] = useState(true);
//   const [consentGiven, setConsentGiven] = useState(false);

//   // Check saved consent on mount
//   useEffect(() => {
//     const savedConsent = localStorage.getItem('ipConsent');
//     if (savedConsent) {
//       setConsentGiven(savedConsent === 'true');
//       setShowConsentModal(false);
//     }
//   }, []);

//   useEffect(() => {
//     async function getLocalIPs() {
//       const pc = new RTCPeerConnection();

//       // bikin data channel dummy (supaya ICE candidate bisa muncul)
//       pc.createDataChannel("");

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log("Candidate:", event.candidate.candidate);
//           // contoh parsing ip dari candidate
//           const parts = event.candidate.candidate.split(" ");
//           const ip = parts[4];
//           console.log("IP ditemukan:", ip);
//         }
//       };
//     }

//     getLocalIPs();
//   }, []);

//   const submit: FormEventHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await auth.login({ email, password });

//       if (Number(res?.data?.isActive) !== 2) {
//         throw new Error('Account needs activation');
//       }

//       console.log('res login', res?.data)

//       const token = res?.data?.token;
//       if (token) {
//         localStorage.setItem('token', token);
//         console.log('Token saved to localStorage:', token);
//         console.log('Login with Public IP:', publicIp);
//       } else {
//         console.error('Token not found in response');
//       }

//       alert.success('Welcome back!');
//       navigate('/', { replace: true });
//     } catch (err: any) {
//       alert.error(err?.message || 'System error occurred');
//     }
//   };

// return (
//     <form onSubmit={submit} className="space-y-6">
//       <VokadashHead>
//         <title>{`Login | ${APP_CONFIG.appName}`}</title>
//       </VokadashHead>

//       <div className="space-y-6">
//         <div className="space-y-3">
//           <Label className="text-slate-300 text-[13px] font-medium ml-1">Email</Label>
//           <Input
//             type="email"
//             placeholder="name@example.com"
//             required
//             value={email}
//             onChange={({ target: { value } }) => setEmail(value)}
//             className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
//           />
//         </div>

//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <Label className="text-slate-300 text-[13px] font-medium ml-1">Password</Label>
//             <Link to="/auth/forget-password" 
//                   className="text-[12px] text-blue-500 hover:text-blue-400 transition-colors">
//               Forgot?
//             </Link>
//           </div>
//           <InputSecure
//             required
//             value={password}
//             onChange={({ target: { value } }) => setPassword(value)}
//             placeholder="••••••••"
//             className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
//           />
//         </div>
//       </div>

//       <Button 
//         type="submit" 
//         disabled={auth.isLoading} 
//         className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/10"
//       >
//         {auth.isLoading ? 'Authenticating...' : 'Sign In'}
//       </Button>

//       <div className="text-center pt-2">
//         <p className="text-[13px] text-slate-500">
//           New here?{' '}
//           <Link to="/schools/register" className="text-slate-200 hover:text-blue-400 font-medium transition-colors">
//             Create an account
//           </Link>
//         </p>
//       </div>
//     </form>
//   );
// };









import { APP_CONFIG } from '@/core/configs';
import { Button, Input, Label, VokadashHead } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { FormEventHandler, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login({ email, password });
      
      // Sesuai response Anda: { success: true, token: "..." }
      const token = res.data.token;

      if (token) {
        // 1. Simpan token
        localStorage.setItem('token', token);
        
        alert.success('Login berhasil!');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 300);
      } else {
        alert.error('Gagal mendapatkan token dari server');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Email atau password salah';
      alert.error(msg);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <VokadashHead>
        <title>{`Login | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-slate-300 text-[13px] font-medium ml-1">Akun Email</Label>
          <Input
            type="email"
            placeholder="name@example.com"
            autoComplete="username" // Solusi warning console
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
            autoComplete="current-password" // Solusi warning console
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
        {auth.isLoading ? 'Memproses...' : 'Masuk'}
      </Button>

      <div className="text-center pt-2">
        <p className="text-[13px] text-slate-500">
          Buat akun baru?{' '}
          <Link to="/schools/register" className="text-blue-400 font-medium transition-colors">
            klik sekarang
          </Link>
        </p>
      </div>
    </form>
  );
};