console.log("DEBUG: script.js file is starting to load.");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DEBUG: DOMContentLoaded event fired.");

    // --- 数据定义 (保持不变) ---
    const packageDutyList = [
        "艾玄叶", "杜玉霖", "陆朝钰", "李佳城", "柳婷", "王丹瑶",
        "徐靖卓", "周红越", "朱迅", "陈卓", "黄天润", "李明杰",
        "马乾乾", "李林阳", "马畅", "齐子欣", "苏万凯", "孙肇骏"
    ];

    const labDutyGroups = [
        { group: "第一组", members: ["李明杰", "王丹瑶"] },
        { group: "第二组", members: ["马畅", "徐靖卓"] },
        { group: "第三组", members: ["马乾乾", "朱迅"] },
        { group: "第四组", members: ["陈卓", "陆朝钰"] },
        { group: "第五组", members: ["苏万凯", "周红越"] },
        { group: "第六组", members: ["孙肇骏", "艾玄叶"] },
        { group: "第七组", members: ["黄天润", "柳婷"] },
        { group: "第八组", members: ["李林阳", "杜玉霖"] },
        { group: "第九组", members: ["齐子欣", "李佳城"] }
    ];

    // --- 基准信息 (保持不变) ---
    const SEMESTER_WEEK1_MONDAY = new Date(2025, 1, 17); // 月份是0-indexed, 1 = Feb
    console.log("DEBUG: SEMESTER_WEEK1_MONDAY set to:", SEMESTER_WEEK1_MONDAY);


    // --- 辅助函数 (保持不变) ---
    function getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function formatDate(date) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    function getWeekInfo(targetDate) {
        const currentMonday = getMonday(new Date(targetDate));
        const oneDay = 24 * 60 * 60 * 1000;
        const weekNumber = Math.floor((currentMonday - SEMESTER_WEEK1_MONDAY) / (7 * oneDay)) + 1;
        const weekStartDate = new Date(currentMonday);
        const weekEndDate = new Date(currentMonday);
        weekEndDate.setDate(currentMonday.getDate() + 6);
        return {
            semesterWeek: weekNumber,
            displaySemesterWeek: weekNumber, // 用于显示的学期周数
            startDate: weekStartDate,
            endDate: weekEndDate,
            displayDates: `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`
        };
    }

    function getDutyPersonnel(semesterWeek) {
        const packageIndex = (semesterWeek - 1 + packageDutyList.length) % packageDutyList.length;
        const labGroupIndex = (semesterWeek - 1 + labDutyGroups.length) % labDutyGroups.length;
        const packagePerson = packageDutyList[packageIndex];
        const labGroup = labDutyGroups[labGroupIndex];
        return {
            packagePerson: packagePerson,
            labGroupText: `${labGroup.group} (${labGroup.members.join("、")})`
        };
    }

    // --- 主逻辑函数 (值日安排) ---
    function updateRoster() {
        console.log("DEBUG: updateRoster function CALLED.");
        const today = new Date();
        // 测试用：
        // const today = new Date(2025, 4, 5); // 2025年5月5日 (周一，第12周开始)
        console.log("DEBUG: Current date for roster in updateRoster:", today);

        // 本周信息
        const currentWeekData = getWeekInfo(today);
        console.log("DEBUG: currentWeekData for roster:", currentWeekData);
        const currentDuty = getDutyPersonnel(currentWeekData.semesterWeek);
        console.log("DEBUG: currentDuty for roster:", currentDuty);

        const currentWeekTitleEl = document.getElementById('current-week-title');
        const currentWeekDatesEl = document.getElementById('current-week-dates');
        const currentPackagePersonEl = document.getElementById('current-package-person');
        const currentLabGroupEl = document.getElementById('current-lab-group');

        // 修改标题以包含周数
        if(currentWeekTitleEl) currentWeekTitleEl.textContent = `本周值日 (第 ${currentWeekData.displaySemesterWeek} 周)`;
        if(currentWeekDatesEl) currentWeekDatesEl.textContent = currentWeekData.displayDates;
        if(currentPackagePersonEl) currentPackagePersonEl.textContent = currentDuty.packagePerson;
        if(currentLabGroupEl) currentLabGroupEl.textContent = currentDuty.labGroupText;

        // 下周预报
        const nextWeekRosterEl = document.getElementById('next-week-roster');
        // 预报逻辑可以根据需要调整，例如周四开始显示，或者一直显示
        // if (today.getDay() >= 4 || today.getDay() === 0) {
        if (true) { // 暂时一直显示下周预报
            console.log("DEBUG: Displaying next week roster.");
            const nextWeekStartDateForCalc = new Date(currentWeekData.startDate);
            nextWeekStartDateForCalc.setDate(nextWeekStartDateForCalc.getDate() + 7); // 下周一的日期

            const nextWeekData = getWeekInfo(nextWeekStartDateForCalc);
            console.log("DEBUG: nextWeekData for roster:", nextWeekData);
            const nextDuty = getDutyPersonnel(nextWeekData.semesterWeek);
            console.log("DEBUG: nextDuty for roster:", nextDuty);

            const nextWeekTitleEl = document.getElementById('next-week-title');
            const nextWeekDatesEl = document.getElementById('next-week-dates');
            const nextPackagePersonEl = document.getElementById('next-package-person');
            const nextLabGroupEl = document.getElementById('next-lab-group');

            // 修改标题以包含周数
            if(nextWeekTitleEl) nextWeekTitleEl.textContent = `下周预报 (第 ${nextWeekData.displaySemesterWeek} 周)`;
            
            // 显示下周的日期范围，或者更新时间的提示
            // if(nextWeekDatesEl) nextWeekDatesEl.textContent = nextWeekData.displayDates; // 显示下周日期范围
            // 或者显示更新时间的提示
            if(nextWeekDatesEl) {
                let nextUpdateTime = new Date(currentWeekData.startDate); // 基于本周一开始计算
                nextUpdateTime.setDate(nextUpdateTime.getDate() + 7); // 到下周一
                nextUpdateTime.setHours(8, 0, 0, 0); // 早上8点
                nextWeekDatesEl.textContent = `下次更新于: ${formatDate(nextUpdateTime)} 08:00`;
            }


            if(nextPackagePersonEl) nextPackagePersonEl.textContent = nextDuty.packagePerson;
            if(nextLabGroupEl) nextLabGroupEl.textContent = nextDuty.labGroupText;
            
            if(nextWeekRosterEl) nextWeekRosterEl.style.display = 'block';
        } else {
            console.log("DEBUG: Hiding next week roster.");
            if(nextWeekRosterEl) nextWeekRosterEl.style.display = 'none';
        }
        console.log("DEBUG: updateRoster function FINISHED.");
    }

    // --- 实时日期和时间更新函数 (保持不变) ---
    function updateLiveDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        const weekDay = weekDays[now.getDay()];
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const dateString = `${year}年${month}月${day}日 ${weekDay}`;
        const timeString = `${hours}:${minutes}:${seconds}`;
        const liveDateEl = document.getElementById('live-date');
        const liveTimeEl = document.getElementById('live-time');
        if(liveDateEl) liveDateEl.textContent = dateString;
        if(liveTimeEl) liveTimeEl.textContent = timeString;
    }

    // --- 初始化与定时器设置 (保持不变) ---
    function initializeAndScheduleUpdates() {
        console.log("DEBUG: Initializing and scheduling updates.");
        updateLiveDateTime();
        setInterval(updateLiveDateTime, 1000);
        updateRoster();

        function scheduleWeeklyRosterUpdate() {
            const now = new Date();
            let nextMonday8AM = new Date(now);
            nextMonday8AM.setDate(now.getDate() + (1 - now.getDay() + 7) % 7);
            if (now.getDay() === 1 && now.getHours() >= 8) {
                nextMonday8AM.setDate(nextMonday8AM.getDate() + 7);
            }
            nextMonday8AM.setHours(8, 0, 0, 0);
            const timeUntilNextUpdate = nextMonday8AM.getTime() - now.getTime();
            console.log(`DEBUG: Next weekly roster update scheduled for: ${nextMonday8AM}. Milliseconds until update: ${timeUntilNextUpdate}`);
            if (timeUntilNextUpdate > 0) {
                setTimeout(() => {
                    console.log("DEBUG: Weekly update time reached. Updating roster now...");
                    updateRoster();
                    scheduleWeeklyRosterUpdate();
                }, timeUntilNextUpdate);
            } else {
                console.warn("DEBUG: Calculated next update time is in the past. Retrying schedule in 1 minute.");
                setTimeout(scheduleWeeklyRosterUpdate, 60 * 1000);
            }
        }
        scheduleWeeklyRosterUpdate();
        console.log("DEBUG: Initialization and scheduling FINISHED.");
    }

    initializeAndScheduleUpdates();
});

console.log("DEBUG: script.js file has finished loading.");