import { FormEvent, useState } from "react";
import styles from "./CreateChatRoom.module.scss";

import ApiService, { logOut } from "../../service/axios";

const CreateChatRoom = () => {
	const [roomName, setRoomName] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			setLoading(true);

			if (!roomName.trim()) {
				throw new Error("Please enter roomName");
			}

			await ApiService.post("/chat", {
				roomName: roomName.trim(),
			});

			setRoomName("");
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.newChatRoomContainer}>
			<div className={styles.title}>
				New Chat Room <button onClick={logOut}>Logout</button>
			</div>
			<form onSubmit={onSubmit} className={styles.newChatRoomForm}>
				<input
					type="text"
					placeholder="Enter chat room name"
					value={roomName}
					onChange={(e) => setRoomName(e.target.value)}
				/>
				<button type="submit" disabled={loading || !roomName.trim()}>
					Create
				</button>
			</form>
		</div>
	);
};

export default CreateChatRoom;
