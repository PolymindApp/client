export default class File {

    static promptForFile(accept = '*', multiple = false): Promise<any> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.onchange = (e: any) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.readAsText(file,'UTF-8');
                reader.onload = (readerEvent: any) => {
                    const content = readerEvent.target.result;
                    resolve(content);
                    input.remove();
                }
            }
            input.click();
        })
    }

    static downloadStringAsFilename(json: string, filename: string) {
        const url = window.URL.createObjectURL(new Blob([json]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static isBase64(input: string | null) {
        if (!input) {
            return false;
        }
        if (input.indexOf('base64,') !== -1) {
            input = input.split('base64,')[1];
        }
        const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        return input && base64RegExp.test(input);
    }

    static async base64ToBlob(
        input: string,
    ): Promise<Blob> {
        const res: Response = await fetch(input);
        return await res.blob();
    }

    static urlToBase64(url: string): Promise<string | null> {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                const reader = new FileReader();
                reader.onloadend = function() {
                    const result = (reader.result || '').toString();
                    resolve(result.trim() === '' ? null : result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        })
    }
}
