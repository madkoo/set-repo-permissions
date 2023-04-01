import * as core from '@actions/core'

export const mapTeamToRepo = async function (
  octokit,
  org,
  owner,
  repo,
  team_slug,
  permission
) {
  try {
    core.info(
      `map repository ${repo} to team: ${team_slug}, with permission ${permission}`
    )
      await octokit.rest.teams.addOrUpdateRepoPermissionsInOrg({
        org,
        team_slug,
        owner,
        repo,
        permission
      })
       return true 
  } catch (e) {
    core.warning(
      `Could not map team ${team_slug} to repository ${repo} in org ${org} with permission ${permission}`
    )
    console.log(e)
    return false
  }
}

export const mapUserToRepo = async function (
  octokit,
  ownerAndorg,
  repo,
  userOrTeamSlug,
  permission
) {
  try {
    core.info(
      `map repository ${repo} to user: ${userOrTeamSlug}, with permission ${permission}`
    )

    octokit.rest.repos.addCollaborator({
      owner: ownerAndorg,
      repo,
      username: userOrTeamSlug,
      permission
    })
    return true
  } catch (e) {
    core.warning(
      `Could not map user ${userOrTeamSlug} to repository ${repo} in org ${ownerAndorg} with permission ${permission}`
    )
    console.log(e)
    return false
  }
}

export const sendSuccessMessage = async function (
  octokit,
  updateReposWithPermissions,
  issueNr,
  ownerAndorg,
  targetRepo
) {
  try {

    core.info(
      `Send success message to issue ${issueNr} in repository ${targetRepo}`
    )
    const body = `
      ## 🎉 Mapped repositories to team
   
      ### Repositories with Teams/Users and permissions:
      \`\`\`
      ${updateReposWithPermissions}
      \`\`\`
    `

    await octokit.rest.issues.createComment({
      issue_number: Number(issueNr),
      owner: ownerAndorg,
      repo: targetRepo,
      body: body.replace(/  +/g, '')
    })
  } catch (e) {
    core.warning(
      `Could not send success message to issue ${issueNr} in repository ${targetRepo}`
    )
    console.log(e)
    return
  }
}
