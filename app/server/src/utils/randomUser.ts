/**
 * Generating random user details
 */
const randomUserDetails = async () => {
	try {
		const response = await fetch(
			'https://randomuser.me/api/?inc=name,picture&nat=us'
		);

		const results = await response.json();
		const details = results.results[0];

		return {
			username: details.name.first,
			picture: details.picture.medium,
		};
	} catch (error) {
		console.error('Error<randomUserDetails>: ', error);

		return {
			username: 'Jennie',
			picture: 'https://randomuser.me/api/portraits/med/men/75.jpg',
		};
	}
};

export default randomUserDetails;
