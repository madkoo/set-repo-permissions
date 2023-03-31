# composite-actions

## usages:

```yaml

- uses: madkoo/composite-actions@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    target-org: "Target organization name where repositories are located" 
    repositories: "{'repo1', 'repo2'}"
    teamsOrUsers : "{'team1,admin', 'team2,write', 'team3,read'}" #Or users : "{'user1,admin', 'user2,write', 'user3,read'}"
    action-type: "TEAM" #or USER
    issue-nr : "1"
    target-repo: "repository name where the issue is located"

```