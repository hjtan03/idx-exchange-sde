import './OpenHouseList.css';

function parseRemarks(allData) {
  try {
    const parsed = JSON.parse(allData);
    return parsed.OpenHouseRemarks || null;
  } catch {
    return null;
  }
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minutes} ${period}`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function OpenHouseList({ openHouses }) {
  if (!openHouses || openHouses.length === 0) {
    return <p className="no-open-houses">No open houses scheduled</p>;
  }

  return (
    <div className="open-house-list">
      <h2>Open Houses</h2>
      {openHouses.map((oh, index) => {
        const remarks = parseRemarks(oh.all_data);
        return (
          <div key={index} className="open-house-item">
            <p className="open-house-date">{formatDate(oh.OpenHouseDate)}</p>
            <p className="open-house-time">
              {formatTime(oh.OH_StartTime)} – {formatTime(oh.OH_EndTime)}
            </p>
            {remarks && <p className="open-house-remarks">{remarks}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default OpenHouseList;