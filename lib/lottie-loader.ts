// 로티 파일을 동적으로 로드하는 함수
export const loadLottieAnimation = async (path: string) => {
  try {
    // .lottie 파일인 경우 직접 반환 (lottie-react가 처리)
    if (path.endsWith('.lottie')) {
      return path;
    }
    
    // .json 파일인 경우 JSON으로 파싱
    const response = await fetch(path);
    const animationData = await response.json();
    return animationData;
  } catch (error) {
    console.error('로티 파일 로드 실패:', error);
    return null;
  }
};

// 로티 파일 경로 상수
export const LOTTIE_PATHS = {
  LOADING: '/lottie/loading.json',
  SUCCESS: '/lottie/success.json',
  ERROR: '/lottie/error.json',
  CELEBRATION: '/lottie/celebration.json',
  EYE_MOVEMENT: '/lottie/eye-movement2.json', // eye-movement2.json으로 변경
  ON_1: '/lottie/On_1.json', // 온보딩 첫 번째 화면 캐릭터
  ON_2: '/lottie/On_2.json', // 온보딩 두 번째 화면 캐릭터
  ON_3: '/lottie/On_3.json', // 온보딩 세 번째 화면 캐릭터
  ON_4: '/lottie/On_4.json', // 온보딩 네 번째 화면 프레임
  ON_4_1: '/lottie/On_4-1.json', // 온보딩 네 번째 화면 내부 애니메이션
  ON_5: '/lottie/On_5.json', // 온보딩 다섯 번째 화면 캐릭터
  // 추가 로티 파일 경로들을 여기에 정의
} as const; 