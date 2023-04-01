import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
import {mapTeamToRepo, mapUserToRepo, sendSuccessMessage} from './utils'

//map a team to a repository

async function run() {
  try {
    const token = core.getInput('token')
    const ownerAndorg = core.getInput('target-org')
    const repositories = core.getInput('repositories')
    const teamsOrUser = core.getInput('teamsOrUsers')
    const actionType = core.getInput('action-type')
    const issueNr = core.getInput('issue-nr')
    const targetRepo = core.getInput('target-repo')
    const octokit = new Octokit({auth: token})

    if (!repositories || repositories.length === 0) {
      core.setFailed('No repositories found')
      return
    }
    if (!teamsOrUser || teamsOrUser.length === 0) {
      core.setFailed('No teams or users found')
      return
    }

    const parsedRepos = JSON.parse(repositories)
    const parsedTeams = JSON.parse(teamsOrUser)
    const updateReposWithPermissions = ['']
    //loop through the repositories
    for (const repo of parsedRepos) {
      //loop through the teams
      for (const team of parsedTeams) {
        const teamData = team.split(',')
        const userOrTeamSlug = teamData[0].trim()
        const permission = teamData[1].trim()
        if (actionType === 'TEAM') {
          const res = await mapTeamToRepo(
            octokit,
            ownerAndorg,
            ownerAndorg,
            repo,
            userOrTeamSlug,
            permission
          )
          if (res) {
            updateReposWithPermissions.push(
              `Repository: '${repo}' with Team: ${userOrTeamSlug} ,permission: ${permission}`
            )
          }
        } else {
          const res = await mapUserToRepo(
            octokit,
            ownerAndorg,
            repo,
            userOrTeamSlug,
            permission
          )
          if (res) {
            updateReposWithPermissions.push(
              `Repository: '${repo}' with User: ${userOrTeamSlug} ,permission: ${permission}`
            )
          }
        }
      }
    }
    await sendSuccessMessage(
      octokit,
      updateReposWithPermissions,
      issueNr,
      ownerAndorg,
      targetRepo
    )
  } catch (error: any) {
    core.setFailed(error.message)
  }
}
run()

export default run // For testing
