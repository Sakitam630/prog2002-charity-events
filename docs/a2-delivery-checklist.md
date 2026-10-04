# A2 delivery checklist

Updated: 2026-10-04. A2 only.
Confirmed filename username: Hongke Ouyang.
Git author: Hongke Ouyang <2838356314@qq.com>.
Repository: https://github.com/Sakitam630/prog2002-charity-events

## Source packages

- Use Hongke OuyangA2-clientside.zip and Hongke OuyangA2-api.zip.
- Build from the repository root using scripts/package-a2.ps1. In PowerShell:

      .\scripts\package-a2.ps1 -Username 'Hongke Ouyang'

  Output is written to a new dated directory under submission/ by default.
  Use -OutputDirectory to select a new destination; existing folders are not overwritten.
- Extract both ZIPs into the same empty parent folder; api/ and clientside/ are siblings.
- Include the unmodified database/charityevents_db.sql, also provided separately.
- Follow docs/local-setup.md and docs/api-reference.md.
- Never submit .env, node_modules, .git, .runtime, runtime logs or local database files.
- Check MANIFEST.json and SHA256SUMS.txt in the build output for package contents.
- Source packaging is separate from the report and video submissions.

## Items requiring the student

- Report: user confirmed complete on 2026-10-04. Its file has not been supplied or
  inspected in this task. Confirm it uses the required template and contains an
  accurate GenAI acknowledgement; this is not claimed as independently verified.
- Report and video are submitted separately by the student. The video must be no longer than 15 minutes; see a2-video-checklist.md.
- OneDrive: upload the video to SCU OneDrive and check the marker-facing share link.
- GitHub: confirm the repository is private, invite the correct marker account,
  and confirm the marker can open the repository. Access is not verified here.
- Learning portal: confirm the exact deadline/timezone and required attachments.
  Planned submission is October 10, before October 11; the school notice controls.
- Submit the two source ZIPs, SQL, report, repository link and video link as required.

Module 8 source preparation is delivered through the setup documents and packaging script. Personal deliverables/access checks remain separate.
Do not mark the whole assessment submitted merely because code has been packaged.
