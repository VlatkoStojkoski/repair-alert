const codes = {
  'auth/internal-error': {
    title: 'Внатрешна грешка',
    error: 'Пробајте подоцна',
  },
  'auth/email-already-in-use': {
    title: 'Грешка при регистрација',
    error: 'Оваа адреса е веќе употребена',
  },
  'auth/weak-password': {
    title: 'Грешка при регистрација',
    error: 'Лозинката треба да содржи 6 или повеќе букви, бројки или симболи',
  },
  'auth/wrong-password': {
    title: 'Погрешна лозинка',
    error: 'Лозинката која ја внесовта не е точна',
  },
  'auth/user-not-found': {
    title: 'Непостоечки корисник',
    error: 'Корисникот не е пронајден',
  },
};

export default function getErrorMessage(code) {
  return (
    codes[code] || {
      title: 'Грешка во системот',
      error: 'Пробајте повторно подоцна',
    }
  );
}
