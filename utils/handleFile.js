function convertFileToDataURL(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
	});
}

function createFile(dataURL, filename) {
	var arr = dataURL.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}

async function readFile(filename) {
	const res = await fetch(`/api/download/${filename}`);
	if (res.ok) {
		const data = await res.json();
		return { content: data.fileContent, type: data.type };
	}
}

export { convertFileToDataURL, createFile, readFile };
