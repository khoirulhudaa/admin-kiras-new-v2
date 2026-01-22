// import { APP_CONFIG } from '@/core/configs';
// import { Button, Input, Label, lang, VokadashHead } from '@/core/libs';
// import { InputSecure, useAlert } from '@/features/_global';
// import { FormEventHandler, useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks';

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

//       if (Number(res?.data?.isActive) !== 2) {
//         throw new Error(lang.text('needActiovation'));
//       }

//       const token = res?.data?.token;
//       if (token) {
//         localStorage.setItem('token', token);
//         console.log('Token saved to localStorage:', token);
//       } else {
//         console.error('Token not found in response');
//       }

//       alert.success('Welcome back!');
//       navigate('/', { replace: true });
//     } catch (err: any) {
//       alert.error(err?.message || lang.text('errSystem'));
//     }
//   };

//   return (
//     <form onSubmit={submit}>
//       <VokadashHead>
//         <title>{`${lang.text('login')} | ${APP_CONFIG.appName}`}</title>
//       </VokadashHead>
//       <div className="grid gap-4">
//         <div className="grid gap-2">
//           <Label htmlFor="email">{lang.text('email')}</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder={lang.text('inputEmail')}
//             required
//             value={email}
//             onChange={({ target: { value } }) => setEmail(value)}
//           />
//         </div>
//         <div className="grid gap-2">
//           <div className="flex items-center">
//             <Label htmlFor="password">{lang.text('password')}</Label>
//           </div>
//           <InputSecure
//             id="password"
//             required
//             value={password}
//             onChange={({ target: { value } }) => setPassword(value)}
//             placeholder={lang.text('inputPassword')}
//           />
//           <div className="text-right">
//             <Link to="/auth/forget-password" className="text-xs underline">
//               {lang.text('forgetPassword') + '?'}
//             </Link>
//           </div>
//         </div>
//         <Button type="submit" disabled={auth.isLoading} className="w-full">
//           {auth.isLoading ? lang.text('pleaseWait') : lang.text('login')}
//         </Button>
//         <div>
//           <p className="text-sm">
//             {lang.text('schoolNotRegistered')}{' '}
//             <Link to="/schools/register" className="underline">
//               {lang.text('registerHere')}
//             </Link>
//           </p>
//         </div>
//       </div>
//     </form>
//   );
// };

import { APP_CONFIG } from '@/core/configs';
import { Button, Input, Label, VokadashHead } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { FormEventHandler, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [publicIp, setPublicIp] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);

  // Fetch public IP only if consent is given
  // useEffect(() => {
  //   if (consentGiven) {
  //     const fetchPublicIp = async () => {
  //       try {
  //         const response = await fetch('https://api.ipify.org?format=json');
  //         const data = await response.json();
  //         setPublicIp(data.ip);
  //         console.log('Public IP:', data.ip);
  //       } catch (err) {
  //         console.error('Failed to fetch public IP:', err);
  //       }
  //     };
  //     fetchPublicIp();
  //   }
  // }, [consentGiven]);

  const handleConsent = (agree: boolean) => {
    setConsentGiven(agree);
    setShowConsentModal(false);
    // Optionally save consent to localStorage
    localStorage.setItem('ipConsent', agree.toString());
  };

  // Check saved consent on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('ipConsent');
    if (savedConsent) {
      setConsentGiven(savedConsent === 'true');
      setShowConsentModal(false);
    }
  }, []);

  useEffect(() => {
    async function getLocalIPs() {
      const pc = new RTCPeerConnection();

      // bikin data channel dummy (supaya ICE candidate bisa muncul)
      pc.createDataChannel("");

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Candidate:", event.candidate.candidate);
          // contoh parsing ip dari candidate
          const parts = event.candidate.candidate.split(" ");
          const ip = parts[4];
          console.log("IP ditemukan:", ip);
        }
      };
    }

    getLocalIPs();
  }, []);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login({ email, password });

      if (Number(res?.data?.isActive) !== 2) {
        throw new Error('Account needs activation');
      }

      console.log('res login', res?.data)

      const token = res?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage:', token);
        console.log('Login with Public IP:', publicIp);
      } else {
        console.error('Token not found in response');
      }

      alert.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (err: any) {
      alert.error(err?.message || 'System error occurred');
    }
  };

  return (
    <>
      {/* Consent Modal */}
      {/* {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Data Usage Consent</h2>
            <p className="text-sm mb-4">
              We collect your public IP address to provide personalized ads and analytics. Do you agree to this data collection?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => handleConsent(false)}
                className="bg-gray-300 text-black"
              >
                Decline
              </Button>
              <Button
                onClick={() => handleConsent(true)}
                className="bg-blue-600 text-white"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )} */}

      {/* Login Form */}
      <form onSubmit={submit}>
        <VokadashHead>
          <title>{`Login | ${APP_CONFIG.appName}`}</title>
        </VokadashHead>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <InputSecure
              id="password"
              required
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              placeholder="Enter your password"
            />
            <div className="text-right">
              <Link to="/auth/forget-password" className="text-xs underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" disabled={auth.isLoading} className="w-full">
            {auth.isLoading ? 'Please wait...' : 'Login'}
          </Button>
          <div>
            <p className="text-sm">
              Not registered yet?{' '}
              <Link to="/schools/register" className="underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
};