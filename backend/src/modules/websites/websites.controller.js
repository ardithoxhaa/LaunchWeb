import { websitesService } from './websites.service.js';

export async function checkSlugAvailability(req, res) {
  const { slug } = req.params;
  const websiteId = req.query.websiteId ? Number(req.query.websiteId) : null;
  const available = await websitesService.checkSlugAvailability({ slug, excludeWebsiteId: websiteId });
  res.json({ available, slug });
}

export async function updateWebsiteSlug(req, res) {
  const id = Number(req.params.id);
  const { slug } = req.validated.body;
  const website = await websitesService.updateWebsiteSlug({ userId: req.auth.userId, websiteId: id, slug });
  res.json({ website });
}

export async function listWebsitesForBusiness(req, res) {
  const businessId = Number(req.params.businessId);
  const websites = await websitesService.listWebsitesForBusiness({
    userId: req.auth.userId,
    businessId,
  });
  res.json({ websites });
}

export async function createWebsiteFromTemplate(req, res) {
  const { businessId, templateId, name, slug } = req.validated.body;
  const website = await websitesService.createWebsiteFromTemplate({
    userId: req.auth.userId,
    businessId,
    templateId,
    name,
    slug,
  });
  res.status(201).json({ website });
}

export async function createBlankWebsite(req, res) {
  const { businessId, name, slug } = req.validated.body;
  const website = await websitesService.createBlankWebsite({
    userId: req.auth.userId,
    businessId,
    name,
    slug,
  });
  res.status(201).json({ website });
}

export async function getWebsite(req, res) {
  const id = Number(req.params.id);
  const website = await websitesService.getWebsite({ userId: req.auth.userId, websiteId: id });
  res.json({ website });
}

export async function getWebsiteStructure(req, res) {
  const id = Number(req.params.id);
  const structure = await websitesService.getWebsiteStructure({ userId: req.auth.userId, websiteId: id });
  res.json(structure);
}

export async function getWebsiteBuilder(req, res) {
  const id = Number(req.params.id);
  const builder = await websitesService.getWebsiteBuilder({ userId: req.auth.userId, websiteId: id });
  res.json(builder);
}

export async function updateWebsiteStructure(req, res) {
  const id = Number(req.params.id);
  const { pages } = req.validated.body;
  const structure = await websitesService.replaceWebsiteStructure({
    userId: req.auth.userId,
    websiteId: id,
    pages,
  });
  res.json(structure);
}

export async function updateWebsiteBuilder(req, res) {
  const id = Number(req.params.id);
  const { pages } = req.validated.body;
  const builder = await websitesService.replaceWebsiteBuilder({
    userId: req.auth.userId,
    websiteId: id,
    pages,
  });
  res.json(builder);
}

export async function updateWebsiteSeo(req, res) {
  const id = Number(req.params.id);
  const { seo } = req.validated.body;
  const website = await websitesService.updateWebsiteSeo({ userId: req.auth.userId, websiteId: id, seo });
  res.json({ website });
}

export async function updateWebsiteSettings(req, res) {
  const id = Number(req.params.id);
  const { settings } = req.validated.body;
  const website = await websitesService.updateWebsiteSettings({
    userId: req.auth.userId,
    websiteId: id,
    settings,
  });
  res.json({ website });
}

export async function publishWebsite(req, res) {
  const id = Number(req.params.id);
  const website = await websitesService.publishWebsite({ userId: req.auth.userId, websiteId: id });
  res.json({ website });
}

export async function unpublishWebsite(req, res) {
  const id = Number(req.params.id);
  const website = await websitesService.unpublishWebsite({ userId: req.auth.userId, websiteId: id });
  res.json({ website });
}

export async function listWebsiteVersions(req, res) {
  const id = Number(req.params.id);
  const versions = await websitesService.listWebsiteVersions({ userId: req.auth.userId, websiteId: id });
  res.json({ versions });
}

export async function restoreWebsiteVersion(req, res) {
  const id = Number(req.params.id);
  const versionId = Number(req.params.versionId);
  const structure = await websitesService.restoreWebsiteVersion({
    userId: req.auth.userId,
    websiteId: id,
    versionId,
  });
  res.json(structure);
}

export async function addPage(req, res) {
  const id = Number(req.params.id);
  const { name, path } = req.validated.body;
  const page = await websitesService.addPage({
    userId: req.auth.userId,
    websiteId: id,
    name,
    path,
  });
  res.status(201).json({ page });
}

export async function updatePage(req, res) {
  const id = Number(req.params.id);
  const pageId = Number(req.params.pageId);
  const { name, path } = req.validated.body;
  const page = await websitesService.updatePage({
    userId: req.auth.userId,
    websiteId: id,
    pageId,
    name,
    path,
  });
  res.json({ page });
}

export async function deletePage(req, res) {
  const id = Number(req.params.id);
  const pageId = Number(req.params.pageId);
  await websitesService.deletePage({
    userId: req.auth.userId,
    websiteId: id,
    pageId,
  });
  res.json({ success: true });
}

export async function getWebsiteAnalytics(req, res) {
  const id = Number(req.params.id);
  const analytics = await websitesService.getWebsiteAnalytics({
    userId: req.auth.userId,
    websiteId: id,
  });
  res.json({ analytics });
}

export async function exportWebsite(req, res) {
  try {
    const id = Number(req.params.id);
    const { files, websiteName } = await websitesService.exportWebsite({
      userId: req.auth.userId,
      websiteId: id,
    });

    // If only one page, return single HTML file
    if (files.length === 1) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${files[0].filename}"`);
      res.send(files[0].content);
      return;
    }

    // Multiple pages - create ZIP archive
    const archiver = (await import('archiver')).default;
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    const slugName = websiteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'website';
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${slugName}-export.zip"`);
    
    archive.pipe(res);
    
    // Add each HTML file to the archive
    for (const file of files) {
      archive.append(file.content, { name: file.filename });
    }
    
    // Add a simple README
    const readme = `# ${websiteName} - Exported Website

This website was exported from LaunchWeb.

## Files included:
${files.map(f => `- ${f.filename}`).join('\n')}

## How to use:

### Option 1: Local Web Server (Recommended)
1. Extract all files to a folder
2. Start a local web server:
   - Python: \`python -m http.server 8000\`
   - Node.js: \`npx serve\`
   - Live Server extension in VS Code
3. Open http://localhost:8000 in your browser

### Option 2: Direct File Access
1. Extract all files to a folder
2. Double-click index.html
3. Note: Some browsers may block local file access due to security policies

### Option 3: Web Hosting
1. Upload all files to your web server
2. Ensure the server serves static files
3. Access your website via the provided URL

## Important Notes
- The exported HTML files are self-contained and work offline
- All styles and content are embedded in the HTML files
- No external dependencies are required
- For best results, use a local web server or proper web hosting

© ${new Date().getFullYear()} - Exported from LaunchWeb
`;
    archive.append(readme, { name: 'README.md' });
    
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      throw err;
    });
    
    await archive.finalize();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: { message: 'Failed to export website' } });
  }
}

export async function deleteWebsite(req, res) {
  try {
    const id = Number(req.params.id);
    const result = await websitesService.deleteWebsite({
      userId: req.auth.userId,
      websiteId: id,
    });

    if (result.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: { message: 'Failed to delete website' } });
    }
  } catch (error) {
    console.error('Delete website error:', error);
    res.status(500).json({ error: { message: 'Failed to delete website' } });
  }
}
