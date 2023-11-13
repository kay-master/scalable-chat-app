import { ChatRoom } from "./chat.interface";

export interface UserResponseData {
	userId: number;
	username: string;
	email: string;
	picture: string;
}

export interface UserSessionResponse {
	user: UserResponseData;
	token: string;
}

export const MOCK_CHAT_LIST: ChatRoom[] = [
	{
		picture: "https://randomuser.me/api/portraits/men/54.jpg",
		roomId: "dsajdkdnsakdjqwio",
		name: "Andrew",
		timestamp: "10am",
	},
	{
		picture: "https://randomuser.me/api/portraits/women/70.jpg",
		roomId: "12342refserqwq",
		name: "MacBook",
		timestamp: "10am",
	},
	{
		picture: "https://randomuser.me/api/portraits/men/54.jpg",
		roomId: "2342fdfsf",
		name: "John",
		timestamp: "11pm",
	},
	{
		picture: "https://randomuser.me/api/portraits/women/70.jpg",
		roomId: "3432tedfd",
		name: "Max",
		timestamp: "10am",
	},
	{
		picture: "https://randomuser.me/api/portraits/men/54.jpg",
		roomId: "123efsgfsrwq",
		name: "Tate",
		timestamp: "11pm",
	},
	{
		picture: "https://randomuser.me/api/portraits/women/70.jpg",
		roomId: "12356fsdfds",
		name: "Pepsi",
		timestamp: "10am",
	},
];
