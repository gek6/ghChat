import * as qiniu from 'qiniu-js';
import secret from '../secret';

export default async function upload(file, completeEvent) {
  window.socket.emit('getQiniuToken', (data) => {
    console.log('getQiniuToken~', data);
    const uploadToken = data;
    const observer = {
      next(res) {
        console.log('qiniu observer next', res);
        // ...
      },
      error(err) {
        console.log('qiniu observer err', err);
        return err;
        // ...
      },
      complete(res) {
        // ...
        console.log('qiniu observer complete', res);
        const fileUrl = `${secret.qiniuDomain}${res.key}`;
        completeEvent(fileUrl);
      }
    };

    const config = { useCdnDomain: true };
    const putExtra = { mimeType: ['image/png', 'image/jpeg', 'image/gif'] };
    const { userId } = JSON.parse(localStorage.getItem('userInfo'));
    const key = `${userId}_${new Date().getTime()}_${file.name}`;
    console.log('file, key, uploadToken, putExtra, config', file, key, uploadToken, putExtra, config);
    const observable = qiniu.upload(file, key, uploadToken, putExtra, config);
    const subscription = observable.subscribe(observer); // 上传开始
  });
  // subscription.unsubscribe(); // 上传取消
}