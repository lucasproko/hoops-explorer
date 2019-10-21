import { NextApiRequest, NextApiResponse } from 'next'
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse"

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(sampleTeamStatsResponse)
}
