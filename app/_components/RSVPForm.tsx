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
import { ReactFormState } from 'react-dom/client';
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
			toast({
				title: 'Failed to submit RSVP',
				description: response.message,
				variant: 'destructive',
			});

			//TODO:Check is email already submitted
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
		<div className="max-w-md mx-auto my-10 ">
			<h1 className="text-2xl font-bold mb-4 text-center border rounded-md border-black">
				{strings.title}
			</h1>
			<p className="mb-6">{strings.description}</p>
			<div className="mb-4">
				<Label>{strings.eventDateLabel}</Label>
				{/* <p>{new Date(strings.eventDate).toLocaleDateString()}</p> */}
				<Calendar
					mode="single"
					selected={new Date(strings.eventDate)}
					className="border flex flex-col items-center rounded-md"
					fromDate={new Date(strings.eventDate)}
					toDate={new Date(strings.eventDate)}
					defaultMonth={new Date(strings.eventDate)}
					ISOWeek
				/>

				<div className="mt-4">
					<Button
						type="button"
						variant="outline"
						className="w-full text-black hover:bg-[#793bef]"
						onClick={openGoogleMaps}
					>
						<MapPin className="w-full" />
						{strings.viewOnMapButton}
					</Button>
				</div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<Label htmlFor="name">{strings.nameLabel}</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					{errors.name && (
						<p className="text-red-500 text-sm mt-1">{errors.name}</p>
					)}
				</div>
				<div>
					<Label htmlFor="email">{strings.emailLabel}</Label>
					<Input
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">{errors.email}</p>
					)}
				</div>
				<div>
					<Label htmlFor="accompany">{strings.accompanyLabel}</Label>
					<Input
						id="accompany"
						type="number"
						min="0"
						value={accompany || ''}
						onChange={(e) => setAccompany(e.target.value)}
					/>
				</div>
				<div>
					<Label>{strings.rsvpLabel}</Label>
					<RadioGroup value={attendance} onValueChange={setAttendance}>
						<div className="flex items-center space-x-2">
							<RadioGroupItem id="yes" value="yes" />
							<Label htmlFor="yes">{strings.yesOption}</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem id="no" value="no" />
							<Label htmlFor="no">{strings.noOption}</Label>
						</div>
					</RadioGroup>
				</div>
				<Button disabled={isLoading} type="submit">
					{isLoading ? 'Sending...' : strings.submitButton}
				</Button>
			</form>
		</div>
	);
};

export default RSVPForm;

