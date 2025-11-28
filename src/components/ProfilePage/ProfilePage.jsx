import UserContext from '../../contexts/UserContext';
import { useContext, useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusInput, setStatusInput] = useState('');

  // Fetch user's status from the database
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `/users/${user.username}`)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return alert('Could not find information about you at this time.');
        }

        setStatus(response.user.status);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => setLoading(false));
  }, [user.username]);

  function handleStatusInput(event) {
    setStatusInput(event.target.value);
  }

  function updateStatus(newStatus) {
    fetch(import.meta.env.VITE_API + `/users/${user.username}/status`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return alert('Could not change status at this time.');
        }

        setStatus(response.status);
        setStatusInput('');
      })
      .catch((err) => alert(err.message));
  }

  return (
    <>
      <h1 className={styles.h1}>Hi, {user.username}!</h1>
      <p className={styles.status}>
        Status : {loading ? 'Loading...' : status ? status : 'No status.'}
      </p>
      <h2 className={styles.h2}>Change Status</h2>
      <form className={styles.form}>
        <label className={styles.input}>
          New status:
          <input
            type="text"
            name="status"
            value={statusInput}
            onChange={handleStatusInput}
            className={styles['input-field']}
          />
        </label>
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => updateStatus(statusInput)}
            className={`${styles.btn} ${styles['change-status-btn']}`}
          >
            Change Status
          </button>
          <button
            type="button"
            onClick={() => updateStatus(null)}
            className={`${styles.btn} ${styles['delete-status-btn']}`}
          >
            Delete Status
          </button>
        </div>
      </form>
    </>
  );
}

export default ProfilePage;
