import { NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';
import mime from 'mime';

export const GET = async (req, { params }) => {
	const filename = params.filename;
	const filepath = path.join(process.cwd(), 'public/assets/' + filename);
	try {
		const fileContent = await readFile(filepath, 'base64');
		const type = mime.getType(filepath);
		return NextResponse.json({
			Message: 'Success',
			fileContent,
			type,
			status: 200,
		});
	} catch (error) {
		console.log('Error occured ', error);
		return NextResponse.json({ Message: 'Failed', status: 500 });
	}
};
