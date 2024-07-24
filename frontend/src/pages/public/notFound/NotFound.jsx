import Button from '../../../components/button/Button';

export default function NotFound() {
  return (
    <div>
      <h3 style={{ marginBottom: '1em' }}>
        Sorry, the page you were looking for was not found.
      </h3>
      <Button url="/" text="Home" />
    </div>
  );
}
