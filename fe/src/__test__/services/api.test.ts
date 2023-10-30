import { api } from '@services/index';
import ky from 'ky';

jest.mock('ky');

describe('ApiService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call ky.get() for GET request and return JSON object', async () => {
    const response = { data: { name: 'John' } };
    (ky.create as jest.Mock).mockReturnValue(ky);
    (ky.get as jest.Mock).mockResolvedValue(response);

    const result = await api.get('/users');
    console.log(result, 'result');

    expect(ky.get).toHaveBeenCalledWith('/users', expect.objectContaining({ searchParams: {} }));
    expect(result).toEqual(response.data);
  });
});
