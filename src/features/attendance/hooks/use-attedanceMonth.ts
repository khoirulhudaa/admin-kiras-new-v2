// import { biodataService } from '@/core/services';
// import { useAuth } from '@/features/auth';
// import { useProfile } from '@/features/profile';
// import { useQuery } from '@tanstack/react-query';
// import { useMemo } from 'react';

// interface AttendanceParams {
//   mode: 'daily' | 'monthly' | 'yearly';
//   page?: number;
//   limit?: number;
// }

// export const useAttendanceNew = ({ mode, page = 1, limit = 20 }: AttendanceParams) => {
//   console.log('useAttendanceNew dipanggil dengan:', { mode, page, limit });
//   const auth = useAuth();
//   const profile = useProfile();
//   const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

//   const query = useQuery({
//     enabled,
//     queryKey: ['attendance', mode, page, limit],
//     queryFn: () => {
//       if (mode === 'daily') {
//         return biodataService.attendanceDaily({ page, limit });
//       } else if (mode === 'monthly') {
//         return biodataService.attedanceMonth({ page, limit });
//       } else {
//         return biodataService.attedanceYear({ page, limit });
//       }
//     },
//     refetchOnWindowFocus: true,
//   });

//   const data = useMemo(() => query.data || { data: [], pagination: {} }, [query.data]);
//   const isLoading = query.isLoading || query.isFetching || query.isPending;

//   const memberOptions: never[] = [];

//   return {
//     query,
//     data,
//     memberOptions,
//     isLoading,
//   };
// };

import { biodataService } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface AttendanceParams {
  mode: 'daily' | 'monthly' | 'yearly';
  page?: number;
  limit?: number;
  namaKelas?: string; // Tambahkan namaKelas sebagai parameter opsional
}

export const useAttendanceNew = ({ mode, page = 1, limit = 20, namaKelas }: AttendanceParams) => {
  console.log('useAttendanceNew dipanggil dengan:', { mode, page, limit, namaKelas });
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ['attendance', mode, page, limit, namaKelas], // Tambahkan namaKelas ke queryKey
    queryFn: () => {
      if (mode === 'daily') {
        return biodataService.attendanceDaily({ page, limit, namaKelas });
      } else if (mode === 'monthly') {
        return biodataService.attedanceMonth({ page, limit, namaKelas });
      } else {
        return biodataService.attedanceYear({ page, limit, namaKelas });
      }
    },
    // refetchInterval: 60000, // Refetch setiap 1 menit (60.000 milidetik)
    refetchOnWindowFocus: false,
  });

  const data = useMemo(() => query.data || { data: [], pagination: {} }, [query.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  const memberOptions: never[] = [];

  return {
    query,
    data,
    memberOptions,
    isLoading,
  };
};