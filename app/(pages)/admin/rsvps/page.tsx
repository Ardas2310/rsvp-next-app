'use server';

import RSVPtable from '@/app/_components/RSVPtable';
import { getRSVP } from '@/app/actions/getRSVP';
import { Button } from '@/components/ui/button';
import { House } from 'lucide-react';
import Link from 'next/link';

export default async function RSVPsPage() {
	const { success, data, message } = await getRSVP();

    //TODO: redirect to login if not authenticated

	return (
		<div className="container mx-auto mt-8 p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">RSVPs</h1>
				<div className="flex items-center gap-2">
					<Button variant={'outline'}>Sign Out</Button>
					<Link href={'/'}>
						<Button variant="default">
							<House />
							Home
						</Button>
					</Link>
				</div>
			</div>

			<RSVPtable data={data || []} />
		</div>
	);
}
