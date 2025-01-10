'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/app/actions/auth';
import React, { useActionState } from 'react';

async function signInAction(prevState: {error: string} | null, formData: FormData) {
    return await signIn(prevState,formData)
}


const LoginPage = () => {

    const [state, formAction] = useActionState(signInAction, null);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-200">
			<form
				action={formAction}
				className="p-8 bg-white rounded-lg shadow-md w-96"
			>
				<h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
				<div className="space-y-4">
					<div>
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" name="email" required />
					</div>
					<div>
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" name="password" required />
					</div>

                    {/* errors */}
                    {state?.error && (
                        <p className='text-red-500 text-sm'>{state.error}</p>
                    )}
					<Button type="submit" className="w-full">
						Log in
					</Button>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
