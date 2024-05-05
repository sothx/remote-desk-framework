const openAboutWindow = require('about-window').default;
const path = require('path')
const create = () => openAboutWindow({
    icon_path: path.join(__dirname, 'icon.png'),
    package_json_dir: path.resolve(__dirname  + '/../../../'),
    copyright: 'Copyright (c) 2023 sothx',
    homepage: 'https://github.com/sothx/my-remote-desk',
    bug_report_url: 'https://github.com/sothx/my-remote-desk/issues',
})
module.exports = {create}

