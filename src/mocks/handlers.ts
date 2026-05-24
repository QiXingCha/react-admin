import { http, HttpResponse } from 'msw';
import type { UserInfo } from '../types';

const mockUsers: UserInfo[] = [
  { id: '1', username: 'admin', nickname: '管理员', roles: ['admin'] },
  { id: '2', username: 'editor', nickname: '编辑', roles: ['editor'] },
  { id: '3', username: 'viewer', nickname: '访客', roles: ['viewer'] },
];

export const handlers = [
  // 登录接口
  http.post('/api/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string };
    const user = mockUsers.find((u) => u.username === body.username);

    if (!user) {
      return HttpResponse.json(
        { success: false, error: '用户不存在' },
        { status: 401 },
      );
    }

    if (body.password !== '123456') {
      return HttpResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        token: `mock-token-${user.id}-${Date.now()}`,
        user,
      },
    });
  }),

  // 获取用户列表
  http.get('/api/users', () => {
    return HttpResponse.json({
      success: true,
      data: mockUsers,
      meta: { total: mockUsers.length, page: 1, limit: 10 },
    });
  }),

  // 获取当前用户信息
  http.get('/api/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer mock-token-')) {
      return HttpResponse.json(
        { success: false, error: '未授权' },
        { status: 401 },
      );
    }

    const token = authHeader.replace('Bearer mock-token-', '');
    const userId = token.split('-')[0];
    const user = mockUsers.find((u) => u.id === userId) || mockUsers[0];

    return HttpResponse.json({
      success: true,
      data: user,
    });
  }),

  // 获取角色列表
  http.get('/api/roles', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'admin', name: '管理员', description: '系统管理员' },
        { id: 'editor', name: '编辑', description: '内容编辑' },
        { id: 'viewer', name: '访客', description: '只读访客' },
      ],
    });
  }),

  // 系统设置
  http.get('/api/settings', () => {
    return HttpResponse.json({
      success: true,
      data: {
        siteName: 'React 管理后台',
        logo: '/logo.svg',
        theme: 'light',
      },
    });
  }),

  http.put('/api/settings', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: body,
    });
  }),
];
