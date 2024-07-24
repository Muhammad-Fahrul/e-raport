const Footer = () => {
  const today = new Date().getFullYear();
  return (
    <div
      style={{
        height: '60px',
        width: '100%',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>&copy; {today} Design By Fahrul</p>
    </div>
  );
};

export default Footer;
