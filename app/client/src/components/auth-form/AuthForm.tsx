import { FormEvent, useRef, useState } from "react";
import styles from "./AuthForm.module.scss";
import ApiService from "../../service/axios";
import { ApiResponse } from "../../interface/api.interface";
import { UserSessionResponse } from "../../interface/user.interface";
import { storeUserInLocalStorage } from "../../service/storage";

interface Props {
	updateAuthState(): void;
}

const AuthForm = (props: Props) => {
	const { updateAuthState } = props;

	const [shouldRegister, setShouldRegister] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState("");

	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);

	function toggle() {
		setShouldRegister((prev) => !prev);
	}

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			setLoading(true);
			setErrorMessage("");

			const endpoint = shouldRegister ? "/register" : "/login";

			const response = await ApiService.post<
				ApiResponse<UserSessionResponse>
			>(endpoint, {
				email: emailRef.current?.value,
				password: passwordRef.current?.value,
			});

			const { data } = response;

			if (!data.success) {
				setErrorMessage(data.error || "");
				return;
			}

			if (shouldRegister) {
				setShouldRegister(false);
			} else {
				if (response.data.data) {
					storeUserInLocalStorage(response.data.data);

					updateAuthState();
				}
			}

			if (emailRef.current) emailRef.current.value = "";
			if (passwordRef.current) passwordRef.current.value = "";
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className={styles.authFormContainer}>
			<form onSubmit={onSubmit}>
				<h1>Chat - {!shouldRegister ? "Login" : "Register"}</h1>
				<div>
					<div className={styles.authField}>
						<label htmlFor="chat-email">Email</label>
						<input
							type="email"
							placeholder="Enter email address"
							name="chat-email"
							id="chat-email"
							required
							ref={emailRef}
						/>
					</div>
					<div className={styles.authField}>
						<label htmlFor="chat-password">Password</label>
						<input
							type="password"
							ref={passwordRef}
							placeholder="Enter password"
							name="chat-password"
							id="chat-password"
							required
						/>
					</div>
				</div>
				{errorMessage && (
					<div className={styles.error}>{errorMessage}</div>
				)}
				<div className={styles.authBtnContainer}>
					<button className={styles.authBtn} disabled={loading}>
						{!shouldRegister ? "Login" : "Register"}
					</button>
				</div>
				<div className={styles.authQuestion}>
					{shouldRegister && (
						<>
							Already have an account?{" "}
							<button onClick={toggle}>Login</button>
						</>
					)}

					{!shouldRegister && (
						<>
							Don't have an account?{" "}
							<button onClick={toggle}>Register</button>
						</>
					)}
				</div>
			</form>
		</div>
	);
};

export default AuthForm;
