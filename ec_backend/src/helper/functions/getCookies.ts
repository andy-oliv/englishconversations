import Cookies from '../../common/types/cookies';
import * as cookie from 'cookie';

export default function getCookies(cookieHeader: string): Cookies {
  const cookies: Record<string, string> = cookie.parse(`${cookieHeader}`);
  const returnedCookies: Cookies = {
    ec_accessToken: cookies.ec_accessToken,
    ec_refreshToken: cookies.ec_refreshToken,
    ec_admin_access: cookies.ec_admin_access,
  };

  return returnedCookies;
}
