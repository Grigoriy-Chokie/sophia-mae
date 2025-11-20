(()=>{
  const component = document.currentScript.closest('[data-component]');
  const expectedDayElement = component?.querySelector('[data-expected-day]');

  if(!component || !expectedDayElement) return

  const COMPONENT_DATA = JSON.parse(component.dataset.component)

  console.log("COMPONENT_DATA", COMPONENT_DATA)

  const DELIVERY_DAYS = +COMPONENT_DATA.deliveryTime;
  const WEEKEND_DAYS = COMPONENT_DATA.nonWorkingDays.map(day => +day);
  const CUTOFF_HOUR = COMPONENT_DATA.timeEndDay.split(':')[0];
  const CUTOFF_MINUTE = COMPONENT_DATA.timeEndDay.split(':')[1];
  const DELIVERY_RANGE = +COMPONENT_DATA.deliveryRange

  let nowDate = new Date();

  const hour = nowDate.getHours();
  const minute = nowDate.getMinutes();
  const isLate = hour > CUTOFF_HOUR || (hour === CUTOFF_HOUR && minute > CUTOFF_MINUTE);

  if(isLate) nowDate.setDate(nowDate.getDate() + 1);

  while (WEEKEND_DAYS.includes(nowDate.getDay())){
    nowDate.setDate(nowDate.getDate() + 1);
  }

  nowDate.setDate(nowDate.getDate() + DELIVERY_DAYS);

  expectedDayElement.innerHTML = formatDate(nowDate);

  if(DELIVERY_RANGE > 0){
    nowDate.setDate(nowDate.getDate() + DELIVERY_RANGE)
    expectedDayElement.innerHTML += ` - ${formatDate(nowDate)}`;
  }

  function formatDate(date) {
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
})()