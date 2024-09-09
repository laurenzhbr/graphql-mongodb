const axiosInstance = require('../../utils/interceptors');

const query = (status) => `
  {
	digitalIdentity(id: "66db7b5fbbe1351f628ed5f3") {
		nickname
		resource{
			id
			name
			category
			resourceRelationship(relationshipType: "isTargeted"){
				resource{
					name
					category
					resourceRelationship(relationshipType: "isTargeted"){
						resource{
							name
							category
							resourceRelationship(relationshipType: "isTargeted"){
								resource{
									name
									resourceStatus
								}
							}
						}
					}
				}
			}
		}
	}
	}
`;

const gql_use_case_1 =  async (id) => {
    const res = await axiosInstance.post('http://localhost:4000/graphql', {
        query: query("active"),
    });

    return res.duration
}

module.exports = {gql_use_case_1};
