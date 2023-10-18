import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: "-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCQymA43uxF3uA4LTJeSOmhxB5zvLGgEH2boVRBG46ac2f/ggPK6V6rYFxLpWXp+mNlg0WoVLfxVNq7yhY47G9N71F5B9tTfKcG94wSJuOaVqUeIgr/kAN8gy1EOYH6xpM+gFB9UHMj/edK1EaMMeoThIewWbUve6rTNC2ZNp9/7esnl9EgS+FeFcuTS0T+vSTrZBFfB8bNJucdJ1tk9MTtf6y4pv+wtw2Y+E0lkdYzVRWWKTGgTkyf8E/GaWpu9s53ZZHjkX6WKrFQvPtXQ/2dEi3e1KyJSjSWTUaMzs1EjSMoM0K9xqSLql3MwSCV7J8i9ye34VqKJqZPHDDIAVfHAgMBAAECggEAKE+PtoWp9lH0zu8WZNWb5iO57rMMKOoublPeJzpK24lh3OsPr0CF0OTFDXKBC0FgxvRjQlhD1fav5zR+N17sJiCI6E9dqsK7pd7pqmwVVfTlh5wmv7wSnGnRAnuYSn9aoz4KKrlpNQ4NhPHQqluDNefh9yEippOhnaebQlrI0U66v8eUB9DIVmXwGxVEgKzwkDKm4xX5KGnxX7tZRyMczg/ZnxmGWN2aEuMNeRVnQZrRvyr0Vn4uHLAZ08GxYt9M39PVB2c1Mx0ulqwYnIxl+KaAWTuLnsdesjNHGilV5XQ+PG9yAfe56QHkIioNkGFzY6kUA8XtKrK3BD7pJwDWYQKBgQDDvDkjb7apthO0iSJsC+NZLp6zU82QT2y8QCJFl3Gps3koZ/AxQ2tHg1L8iGk44Eyu8SS53K5miU+WRUajbzqSOJYz4MWB0HJcRpQAiIFtl+4OCdY5RjBPwfQzReyCI8QB6o3jYnoA+Vx9SXakJRqUjH7qYbma6HRZ0irk63Z3PwKBgQC9XrWyuJ/9nBQR6xOq0TapApHN3tKqH/XMx5I3sY7WLiWAJiEqQ9KX6t11tWQZVu6mbWQM40UkJaMvz7aWG97sFmRxaWmRtx99B1D6A03SXpe/3gfzcKFSxz5tXEKgOdBm6Be28W3dZRKf1OO7EQ/ycJSyrOuoKfZLYVTkoGFFeQKBgQCDbtWTZQVsKlZLCTazBLyR+wsX8bL8L0kdk5cv0cTCJkC6ECkqe1IDQDyuVE8LoRn88vItV/FH6vYlOrl3L05ON28swMb/J2BTdBUX0pHObJGunY5bATWZqOx4rYBl1uxcOQsz38F6+/bOLlFbYYraqwjiC+MdEPBoDAc/lpkC8wKBgCDT50mpKcsMIIqOpuUoyYH4+Q+oPfrR+YlbW2SeOjW04Dlb4snx4fMF+wgpvsWJxWtCcWKuj1DZ2XUzW+KfyEBDDXx/mpZxGVtSRl5g7j+2uDXBpr0z3DN+aLsKkF44R4FfYKUNK0+C8vyUKjpGle4gSBbFVUDcrV6Z696KUvJ5AoGASWHucAXA5oGNbwgyw20roz1xP7s9UnXXByYQKupVCQ9gUKtx8vXFCSMLeVMiKsu4HZZMbtOUDQkWqPnBF1gQfayeLvQtGwcn+rku2grV8CJC0ZCAq+UIUgknmDpV/Lw6Cs+G3H2llpnBmBfZzFUhCecJHiA7rXiTmnR1yFeG+jw=-----END PRIVATE KEY-----"
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }