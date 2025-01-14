'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { strings } from '@/app/utils/strings';
import { useToast } from '@/hooks/use-toast';
import submitRSVP from '../actions/submitRSVP';

const RSVPForm = () => {
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [accompany, setAccompany] = React.useState<string | null>(null);
	const [attendance, setAttendance] = React.useState('yes');
	const [errors, setErrors] = React.useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = React.useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name) {
			setErrors({ name: 'Name is required' });
			return;
		}
		if (!email) {
			setErrors({ email: 'Email is required' });
			return;
		}

		const formData = new FormData();
		formData.append('name', name);
		formData.append('email', email);
		formData.append('accompany', accompany || '0');
		formData.append('attendance', attendance);

		console.log(formData, 'formData');

		setIsLoading(true);

		const response = await submitRSVP(formData);

		if (response.success) {
			toast({
				title: 'RSVP sent successfully',
				description: strings.thankYouMessage,
			});
			//Reseting
			setName('');
			setEmail('');
			setAccompany(null);
			setAttendance('yes');
			setErrors({});
		} else {
			if (response.error) {
				if (response.error.code === '23505') {
					toast({
						title: 'Already responded',
						description: 'You have already responded to this event',
						variant: 'destructive',
					});
				}
			} else {
				toast({
					title: 'Failed to submit RSVP',
					description: response.message,
					variant: 'destructive',
				});
			}
		}

		setIsLoading(false);
	};

	const openGoogleMaps = () => {
		const encodedLocation = encodeURIComponent(strings.eventLocation);
		window.open(
			`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
		);
	};

	return (
		<div className="max-w-md mx-auto my-10 bg-white/40 p-6 rounded-lg backdrop-filter backdrop-blur-lg border border-white/20 shadow-xl">
			<h1 className="text-2xl font-bold mb-4 text-center border rounded-md border-black/80 bg-white/50 p-2 text-neutral-900">
				{strings.title}
			</h1>
			<p className="mb-6 text-neutral-900 font-medium">{strings.description}</p>
			<div className="mb-4">
				<Label className="text-neutral-900 font-medium">
					{strings.eventDateLabel}
				</Label>
				<Calendar
					mode="single"
					selected={new Date(strings.eventDate)}
					className="border flex flex-col items-center rounded-md border-black/80 bg-white/70 text-neutral-950"
					fromDate={new Date(strings.eventDate)}
					toDate={new Date(strings.eventDate)}
					defaultMonth={new Date(strings.eventDate)}
					ISOWeek
				/>

				<div className="mt-4">
					<Button
						type="button"
						variant="outline"
						className="w-full flex items-center justify-center gap-2 border-black/80 bg-white/70 text-neutral-900 hover:bg-primary hover:text-white transition-all duration-300"
						onClick={openGoogleMaps}
					>
						<MapPin className="h-4 w-4" />
						<span className="font-bold">{strings.viewOnMapButton}</span>
					</Button>
				</div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<Label htmlFor="name" className="text-neutral-900 font-bold">
						{strings.nameLabel}
					</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="bg-white/70 border-black/20 text-neutral-900 placeholder:text-neutral-600"
					/>
					{errors.name && (
						<p className="text-red-500 text-sm mt-1">{errors.name}</p>
					)}
				</div>
				<div>
					<Label htmlFor="email" className="text-neutral-900 font-bold">
						{strings.emailLabel}
					</Label>
					<Input
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="bg-white/70 border-black/20 text-neutral-900 placeholder:text-neutral-600"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">{errors.email}</p>
					)}
				</div>
				<div>
					<Label htmlFor="accompany" className="text-neutral-900 font-bold">
						{strings.accompanyLabel}
					</Label>
					<Input
						id="accompany"
						type="number"
						min="0"
						value={accompany || ''}
						onChange={(e) => setAccompany(e.target.value)}
						className="bg-white/70 border-black/20 text-neutral-900"
					/>
				</div>
				<div>
					<Label className="text-neutral-900 font-bold">
						{strings.rsvpLabel}
					</Label>
					<RadioGroup
						value={attendance}
						onValueChange={setAttendance}
						className="mt-2 space-y-3"
					>
						<div className="flex items-center space-x-3 bg-white/70 p-3 rounded-md border border-black/20 hover:bg-white/90 transition-all duration-300">
							<RadioGroupItem
								id="yes"
								value="yes"
								className="border-black/20 w-5 h-5"
							/>
							<Label
								htmlFor="yes"
								className="text-neutral-900 font-medium cursor-pointer"
							>
								{strings.yesOption}
							</Label>
						</div>
						<div className="flex items-center space-x-3 bg-white/70 p-3 rounded-md border border-black/20 hover:bg-white/90 transition-all duration-300">
							<RadioGroupItem
								id="no"
								value="no"
								className="border-black/20 w-5 h-5"
							/>
							<Label
								htmlFor="no"
								className="text-neutral-900 font-medium cursor-pointer"
							>
								{strings.noOption}
							</Label>
						</div>
					</RadioGroup>
				</div>
				<Button
					disabled={isLoading}
					type="submit"
					className="w-full bg-primary/90 hover:bg-primary text-white"
				>
					{isLoading ? 'Sending...' : strings.submitButton}
				</Button>
			</form>
		</div>
	);
};

export default RSVPForm;
