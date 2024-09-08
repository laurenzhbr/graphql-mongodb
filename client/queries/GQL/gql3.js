const axiosInstance = require('../../utils/interceptors');

const query = (status) => `
  {
	resource(id: "66db76c734ed489b211cd399") {
		category
		name
		resourceRelationship(relationshipType: "isTargeted"){
			resource{
				id
				name
				category
				resourceRelationship(relationshipType: "isTargeted"){
					resource{
						name
						category
						usageState
						resourceRelationship(relationshipType: "isTargeted"){
							resource{
								id
								name
								category
								resourceStatus
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
