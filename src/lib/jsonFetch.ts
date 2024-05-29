export default async (
	input: string | Partial<RequestInit>,
	init?: Partial<RequestInit>,
): Promise<any> =>
	new Promise(async (resolve, reject) =>
		fetch(input as RequestInfo, init)
			.then(async (req) => {
				if (!req.ok) {
					const errorText = await req.text();
					return reject(new Error(errorText));
				}
				return req.json();
			})
			.then(resolve)
			.catch(reject),
	);
