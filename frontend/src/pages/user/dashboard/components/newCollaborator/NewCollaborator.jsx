import { useCallback, useEffect, useState } from 'react';
import {
  useAddCollaboratorMutation,
  useLazyGetCollaboratorsByUsernameQuery,
} from '../../../redux/collaboratorApiSlice';
import useDebounce from '../../../../../hooks/useDebounce';
import './newCollaborator.css'; // Import file CSS untuk styling

function NewCollaborator() {
  const [username, setUsername] = useState('');
  const [collaboratorId, setCollaboratorId] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const debouncedUsername = useDebounce(username, 300);
  const [borderParent, setBorderParent] = useState(false);

  const [addCollaborator, { isLoading: isAdding, isSuccess, isError, error }] =
    useAddCollaboratorMutation();

  const [
    getCollaboratorsByUsername,
    { isLoading: isFetching, isError: isFetchError, error: fetchError },
  ] = useLazyGetCollaboratorsByUsernameQuery();

  const handleFetchCollaborators = useCallback(
    async (debouncedUsername) => {
      try {
        const { users } = await getCollaboratorsByUsername(
          debouncedUsername
        ).unwrap();
        setCollaborators(users);
      } catch (err) {
        console.error('Failed to fetch collaborators: ', err);
      }
    },
    [getCollaboratorsByUsername]
  );

  const handleCollaboratorClick = (id, username) => {
    setUsername(username);
    setCollaboratorId(id);
    setCollaborators([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collaboratorId) {
      return alert('Please select a valid collaborator');
    }
    try {
      await addCollaborator({ collaboratorId }).unwrap();
      setUsername('');
      setCollaboratorId('');
      setCollaborators([]);
    } catch (err) {
      console.error('Failed to add collaborator: ', err);
    }
  };

  useEffect(() => {
    if (debouncedUsername) {
      handleFetchCollaborators(debouncedUsername);
    } else {
      setCollaborators([]);
    }
  }, [debouncedUsername, handleFetchCollaborators]);

  return (
    <div className="add-new-form-section">
      <h3>Add Collaborator</h3>
      <section className={`${borderParent && 'focus'}`}>
        <form onSubmit={handleSubmit} className="collaborator-form">
          <input
            type="text"
            id="username"
            value={username}
            onFocus={() => setBorderParent(true)}
            onBlur={() => setBorderParent(false)}
            placeholder="Collaborator username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <button type="submit" disabled={isAdding} className="add-new-input">
            <i className="fa-solid fa-plus"></i>
          </button>
        </form>
      </section>
      {isFetching && <p>Loading...</p>}
      {isSuccess && <p className="success">Collaborator added successfully!</p>}
      {isError && (
        <p className="error">
          {error?.data?.message || 'Failed to add collaborator'}
        </p>
      )}
      {collaborators.length > 0 && (
        <ul className="collaborator-list">
          {collaborators.map((collaborator) => (
            <li
              key={collaborator._id}
              onClick={() =>
                handleCollaboratorClick(collaborator._id, collaborator.username)
              }
            >
              {`${collaborator.username} - ${collaborator._id}`}
            </li>
          ))}
        </ul>
      )}
      {isFetchError && (
        <p className="error">
        {fetchError?.data?.message || 'Failed to fetch collaborators'}
        </p>
      )}
    </div>
  );
}

export default NewCollaborator;
