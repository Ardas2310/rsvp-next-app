'use server';

import RSVPtable from '@/app/_components/RSVPtable';
import { signOut } from '@/app/actions/auth';
import { getRSVP } from '@/app/actions/getRSVP';
import { Button } from '@/components/ui/button';
import { House } from 'lucide-react';
import Link from 'next/link';

export default async function RSVPsPage() {
	const { success, data, error } = await getRSVP();

	if (!success) {
		return <div className="container mx-auto mt-8 p-4">Error: {error}</div>;
	}

	return (
		<div className="container mx-auto mt-8 p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">RSVPs</h1>
				<div className="flex items-center gap-2">
					<Link href={'/'}>
						<Button variant="default">
							<House />
							Home
						</Button>
					</Link>
					{/* Log Out */}
					<form action={signOut}>
						<Button variant={'outline'}>Sign Out</Button>
					</form>
				</div>
			</div>

			<RSVPtable data={data || []} />
		</div>
	);
}
