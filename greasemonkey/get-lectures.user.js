// ==UserScript==
// @name         抓取讲座信息
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  抓取讲座信息并生成JSON 保存到剪贴板
// @author       RubbishZyc
// @match        https://xkcts.ucas.ac.cn:8443/subject/lecture
// @match        https://xkcts.ucas.ac.cn:8443/subject/humanityLecture
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

function assignIgnoringUndefined(target, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            if (source[key] !== undefined) {
                target[key] = source[key];
            }
        });
    });
    return target;
}

    async function fetchDetails(url) {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        // 根据实际情况调整选择器
        const detailsTable = doc.querySelector('table'); // 选择第一个表格
        let details = {};

        if (detailsTable) {
            const rows = detailsTable.querySelectorAll('tr');
            rows.forEach((row,index) => {
                // const cells = Array.from(row.querySelectorAll('td'));
                const plain = row.innerText;
                const regex = {
                    startTime: /.+开始时间：([^\n]+)/,
                    endTime: /.+结束时间：([^\n]+)/,
                    mainVenue: /.+主会场地点：([^\n]+)/,
                };

                // 提取字段
                const extractedFields = {
                    startTime: plain.match(regex.startTime)?.[1]?.trim(),
                    endTime: plain.match(regex.endTime)?.[1]?.trim(),
                    mainVenue: plain.match(regex.mainVenue)?.[1]?.trim(),
                };
                if (plain.includes("讲座介绍")) {
                    extractedFields.introduction = rows[index + 1]?.querySelector('td')?.textContent.trim();
                }
                assignIgnoringUndefined(details,extractedFields);
            });
        }
      console.log(details);
      return details;
    }

    function downloadFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: fileName,
            saveAs: true
        });
    }

    async function scrapeTable() {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        const data = [];

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            const name = cells[0].innerText;
            const time = cells[2].innerText;
            const detailLink = cells[6].querySelector('a').href;
            console.log('detaill in',detailLink);
            const details = await fetchDetails(detailLink);

            data.push({
                name: name,
                time: time,
                details: details
            });
        }

        // const csvContent = '讲座名称,讲座时间,详情\n' + data.map(item => `${item.name},${item.time},"${item.details.replace(/"/g, '""')}"`).join('\n');
        // downloadFile(csvContent, 'lectures.csv');
        const jsonstr = JSON.stringify(data);
        console.log(jsonstr);
        navigator.clipboard.writeText(jsonstr).then(() => {
            console.log('数据已复制到剪贴板');
            // 打开 t.html
            window.open('http://localhost/gcalendarSyncLectures.html', '_blank');
        }).catch(err => {
            console.error('复制失败:', err);
        });
    }

    const button = document.createElement('button');
    button.innerText = '抓取讲座信息';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.onclick = scrapeTable;

    document.body.appendChild(button);
})();
