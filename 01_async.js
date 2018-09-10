const request = require('request-promise');

console.log('start ...');

/**
 * Get repos with their contributors 
 * @param {string} organization 
 * @param {int} limit 
 */
async function getContributors(organization, limit = 3) {
    async function getContributorsOfReposByOwner(owner, repo) {
        return await request({
            "method":"GET", 
            "uri": `https://api.github.com/repos/${owner}/${repo}/contributors`,
            "json": true,
            "headers": {
                "User-Agent": "request-promise"
            }
        });
    }

    let contributors = {};
    let repos = (await request({
        "method":"GET", 
        "uri": `https://api.github.com/orgs/${organization}/repos`,
        "json": true,
        "headers": {
            "User-Agent": "request-promise"
        }
    })).slice(0, limit);

    for(i in repos) {
        contributors[repos[i].name] = (await getContributorsOfReposByOwner(
            repos[i].owner.login,
            repos[i].name
        )).map((contributor) => contributor.login);
    }
    
    return contributors;
}

getContributors('nodejs')
.then((contributors) => {
        console.log(contributors);
        console.log('end');
    }
)
.catch(
    err => console.log('Something wrong happened')
);

