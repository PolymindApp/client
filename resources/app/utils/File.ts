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
}
