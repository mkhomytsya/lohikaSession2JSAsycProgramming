const request = require('request-promise');

console.log('start ...');

/**
 * Get repos with their contributors 
 * @param {string} organization 
 * @param {int} limit 
 */
function getContributors(organization, limit = 3) {
    return new Promise(function(resolve) {
        function getContributorsOfReposByOwner(owner, repo) {
            return request({
                    "method":"GET", 
                    "uri": `https://api.github.com/repos/${owner}/${repo}/contributors`,
                    "json": true,
                    "headers": {
                        "User-Agent": "request-promise"
                    }
                }).then((result) => [repo, result]);
        }
    
        let contributors = {};
        request({
            "method":"GET", 
            "uri": `https://api.github.com/orgs/${organization}/repos`,
            "json": true,
            "headers": {
                "User-Agent": "request-promise"
            }
        }).then((repos) => {
            Promise.all(repos.slice(0, limit).map((repo) =>  {
                return getContributorsOfReposByOwner(
                    repo.owner.login,
                    repo.name
                );
            })).then((allresult) => {
                allresult.map(([repo, contributorsOfReposByOwner]) => {
                    contributors[repo] = contributorsOfReposByOwner.map((data) => data.login);
                });
                resolve(contributors);
            });          
        });
    });
}

getContributors('nodejs')
.then((contributors) => {
        console.log('final result');
        console.log(contributors);
        console.log('end');
    }
)
.catch(
    err => console.log('Something wrong happened')
);