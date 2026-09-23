import * as bcrypt from 'bcrypt';

export async function hashData(data: string): Promise<string> {
    try {
        const saltOrRounds = 10;
        const salt = await bcrypt.genSalt(saltOrRounds);
        const hashedData = await bcrypt.hash(data, salt);
        return hashedData;
    } catch (error) {
        // log lỗi thật để debug, không log data gốc vì đây có thể là dữ liệu nhạy cảm (refresh token, password...)
        console.error('hashData error:', error);
        throw new Error('Failed to hash data');
    }
}