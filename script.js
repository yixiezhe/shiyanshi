console.log("DEBUG: script.js file is starting to load.");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DEBUG: DOMContentLoaded event fired.");

    // --- 新的数据库定义 ---
    // 快递值日人员名单 (保持不变)
    const packageDutyList = [
        "王奇", "闫志创", "赵国祥", "李先基", "王嘉豪", "肖杰伦",
        "袁野", "李胜涛", "王欣婷", "谢涛", "陈加洛", "姚俊",
        "何霜", "林杨锋", "纪星明", "宋天赐", "杨云昊", "吴鹏飞"
    ];

    // 实验室卫生分组 (已修改：指导老师并入名单，第七组删除闫志创)
    const labDutyGroups = [
        { group: "第一组", members: ["王嘉豪", "林杨锋", "柳婷"] },
        { group: "第二组", members: ["肖杰伦", "纪星明", "李佳城"] },
        { group: "第三组", members: ["袁野", "宋天赐", "徐靖卓"] },
        { group: "第四组", members: ["李胜涛", "杨云昊", "杜玉霖"] },
        { group: "第五组", members: ["王欣婷", "吴鹏飞", "朱迅"] },
        { group: "第六组", members: ["谢涛", "王奇", "陆朝钰"] },
        { group: "第七组", members: ["陈加洛", "王丹瑶"] }, // 删除了闫志创，只有两人
        { group: "第八组", members: ["姚俊", "赵国祥", "李佳城"] },
        { group: "第九组", members: ["何霜", "李先基", "艾玄叶"] }
    ];

    // --- 新的基准信息 ---
    // 基准日期：新的第一周从2025年9月16日(周二)开始，因此我们以那一周的周一(9月15日)为计算基点。
    const SEMESTER_WEEK1_MONDAY = new Date(2025, 8, 15); // 月份是0-indexed, 8 = Sep
    console.log("DEBUG: SEMESTER_WEEK1_MONDAY set to:", SEMESTER_WEEK1_MONDAY);


    // --- 辅助函数 ---
    function getMonday(date) {
        const d = new Date(date);
        // 如果今天是周一且时间在晚上8点之前，我们仍然认为“当前周”是上一周的值日安排。
        // 为了计算方便，我们将日期倒退一天，这样 getMonday 就会返回上一个周一。
        if (d.getDay() === 1 && d.getHours() < 20) {
            d.setDate(d.getDate() - 1);
        }
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        monday.setHours(0, 0, 0, 0); // 标准化到周一的零点
        return monday;
    }

    function formatDate(date) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    function getWeekInfo(targetDate) {
        const currentMonday = getMonday(new Date(targetDate));
        const oneDay = 24 * 60 * 60 * 1000;
        const weekNumber = Math.floor((currentMonday - SEMESTER_WEEK1_MONDAY) / (7 * oneDay)) + 1;

        // 新的周期：周二到下周一
        const weekStartDate = new Date(currentMonday);
        weekStartDate.setDate(currentMonday.getDate() + 1); // 周二

        const weekEndDate = new Date(currentMonday);
        weekEndDate.setDate(currentMonday.getDate() + 7); // 下周一

        return {
            semesterWeek: weekNumber,
            displaySemesterWeek: weekNumber,
            startDate: weekStartDate,
            endDate: weekEndDate,
            displayDates: `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`
        };
    }

    function getDutyPersonnel(semesterWeek) {
        // 取快递人员计算
        const packageIndex = (semesterWeek - 1 + packageDutyList.length) % packageDutyList.length;
        const packagePerson = packageDutyList[packageIndex];

        // 实验室卫生分组计算
        const labGroupIndex = (semesterWeek - 1 + labDutyGroups.length) % labDutyGroups.length;
        const labGroupData = labDutyGroups[labGroupIndex];
        
        // 直接显示组名和所有成员（含原来的指导老师）
        const labGroupText = `${labGroupData.group} (${labGroupData.members.join("、")})`;

        return {
            packagePerson: packagePerson,
            labGroupText: labGroupText
        };
    }

    // --- 主逻辑函数 (值日安排) ---
    function updateRoster() {
        console.log("DEBUG: updateRoster function CALLED.");
        const today = new Date();
        console.log("DEBUG: Current date for roster in updateRoster:", today);

        // 本周信息
        const currentWeekData = getWeekInfo(today);
        console.log("DEBUG: currentWeekData for roster:", currentWeekData);
        const currentDuty = getDutyPersonnel(currentWeekData.semesterWeek);
        console.log("DEBUG: currentDuty for roster:", currentDuty);

        document.getElementById('current-week-title').textContent = `本周值日 (第 ${currentWeekData.displaySemesterWeek} 周)`;
        document.getElementById('current-week-dates').textContent = currentWeekData.displayDates;
        document.getElementById('current-package-person').textContent = currentDuty.packagePerson;
        document.getElementById('current-lab-group').textContent = currentDuty.labGroupText;

        // 下周预报
        const nextWeekStartDateForCalc = new Date(currentWeekData.startDate);
        nextWeekStartDateForCalc.setDate(nextWeekStartDateForCalc.getDate() + 7); // 基于本周二，推算7天后就是下周二

        const nextWeekData = getWeekInfo(nextWeekStartDateForCalc);
        console.log("DEBUG: nextWeekData for roster:", nextWeekData);
        const nextDuty = getDutyPersonnel(nextWeekData.semesterWeek);
        console.log("DEBUG: nextDuty for roster:", nextDuty);

        document.getElementById('next-week-title').textContent = `下周预报 (第 ${nextWeekData.displaySemesterWeek} 周)`;
        
        // 计算并显示下一次准确的更新时间
        const thisWeekMonday = getMonday(new Date(today));
        const nextUpdateMonday = new Date(thisWeekMonday);
        nextUpdateMonday.setDate(thisWeekMonday.getDate() + 7);
        document.getElementById('next-week-dates').textContent = `下次更新于: ${formatDate(nextUpdateMonday)} 20:00`;

        document.getElementById('next-package-person').textContent = nextDuty.packagePerson;
        document.getElementById('next-lab-group').textContent = nextDuty.labGroupText;
        
        document.getElementById('next-week-roster').style.display = 'block'; // 保持一直显示
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
        document.getElementById('live-date').textContent = dateString;
        document.getElementById('live-time').textContent = timeString;
    }

    // --- 初始化与定时器设置 (保持不变) ---
    function initializeAndScheduleUpdates() {
        console.log("DEBUG: Initializing and scheduling updates.");
        updateLiveDateTime();
        setInterval(updateLiveDateTime, 1000);
        updateRoster();

        function scheduleWeeklyRosterUpdate() {
            const now = new Date();
            let nextMonday8PM = getMonday(now); // 获取当前值日周期的周一
            
            // 计算下一次更新的周一
            nextMonday8PM.setDate(nextMonday8PM.getDate() + 7);
            nextMonday8PM.setHours(20, 0, 0, 0); // 设置为晚上8点

            const timeUntilNextUpdate = nextMonday8PM.getTime() - now.getTime();
            console.log(`DEBUG: Next weekly roster update scheduled for: ${nextMonday8PM}. Milliseconds until update: ${timeUntilNextUpdate}`);

            if (timeUntilNextUpdate > 0) {
                setTimeout(() => {
                    console.log("DEBUG: Weekly update time reached. Updating roster now...");
                    updateRoster();
                    // 递归调用，设置下一次的更新
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
