import * as https from 'https';
import { URLSearchParams } from 'url'
import { HcsAccountBalanceList, HcsMessage, HcsMessageList, HcsTokenInfo } from './types';
import { isAddress } from './util';

const agent = new https.Agent({ keepAlive: true });

export async function getHcsMessageByConsensusTimestamp(hostname: string, consensusTimestamp: string): Promise<HcsMessage> {
    const path = `/api/v1/topics/messages/${consensusTimestamp}`;
    const options: https.RequestOptions = { hostname, path, method: 'GET', agent };
    const { code, data } = await executeRequest(options);
    if (code === 200) {
        const hcsMessage = JSON.parse(data.toString('ascii')) as HcsMessage;
        if (!hcsMessage)
        {
            throw new Error(`HCS Message at timestamp ${consensusTimestamp} was not found.`);
        }
        if (hcsMessage.chunk_info)
        {
            throw new Error(`HCS Message ${hcsMessage.sequence_number} has chunks, which are not supported.`);
        }
        if (!hcsMessage.message)
        {
            throw new Error(`HCS Message ${hcsMessage.sequence_number} has no message payload.`);
        }
        if (!isAddress(hcsMessage.topic_id))
        {
            throw new Error(`HCS Message ${hcsMessage.sequence_number} does not have a valid topic id.`);
        }
        if (!isAddress(hcsMessage.payer_account_id))
        {
            throw new Error(`HCS Message ${hcsMessage.sequence_number} does not have a valid payer id.`);
        }
        return hcsMessage;
    } else {
        throw new Error(`Balance for {account} was not found, code: ${code}`);
    }
}

export async function* getValidHcsMessagesInRange(hostname: string, topic: string, startTime: string, endTime: string) {
    const queryParams = new URLSearchParams({ 'order': 'asc', 'limit': '100' });
    queryParams.append('timestamp', `gt:${startTime}`);
    queryParams.append('timestamp', `lt:${endTime}`);
    let path = `/api/v1/topics/${topic}/messages?${queryParams.toString()}`;
    do {
        const options: https.RequestOptions = { hostname, path, method: 'GET', agent };
        const { code, data } = await executeRequest(options);
        if (code === 200) {
            const list = JSON.parse(data.toString('ascii')) as HcsMessageList;
            for (const elem of list.messages) {
                yield elem;
            }
            path = list.links?.next;
        } else {
            throw new Error(`HTS Topic ${topic} was not found, code: ${code}`);
        }
    } while (path);
}

export async function getHcsTokenInfo(hostname: string, token: string): Promise<HcsTokenInfo> {
    const path = `/api/v1/tokens/${token}`;
    const options: https.RequestOptions = { hostname, path, method: 'GET', agent };
    let { code, data } = await executeRequest(options);
    if (code === 200) {
        return JSON.parse(data.toString('ascii'));
    } else {
        throw new Error(`HTS Token ${token} was not found, code: ${code}`);
    }
}

export async function getHcsAccountBalance(hostname: string, account: string, timestamp: string): Promise<HcsAccountBalanceList> {
    const queryParams = new URLSearchParams({ 'account.id': account, 'timestamp': timestamp });
    const path = `/api/v1/balances?${queryParams.toString()}`;
    const options: https.RequestOptions = { hostname, path, method: 'GET', agent };
    let { code, data } = await executeRequest(options);
    if (code === 200) {
        return JSON.parse(data.toString('ascii'));
    } else {
        throw new Error(`Balance for {account} was not found, code: ${code}`);
    }
}

function executeRequest(options: https.RequestOptions): Promise<{ code: number | undefined, data: Buffer }> {
    let data: any[] = [];
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            res.on('data', chunk => { data.push(chunk); });
            res.on('end', () => resolve({ code: res.statusCode, data: Buffer.concat(data) }));
        });
        req.on('error', e => reject(e));
        req.end();
    });
}