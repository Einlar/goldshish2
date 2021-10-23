import { MetaTags } from '@redwoodjs/web'
import { styled } from '@stitches/react'
import { useAuth } from '@redwoodjs/auth'
const HomePage = () => {
  const { logIn, logOut, isAuthenticated, currentUser } = useAuth()

  return (
    <>
      <Page>
        <MetaTags
          title="Home"
          // description="Home description"
          /* you should un-comment description and add a unique description, 155 characters or less
        You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
        />
        <div className="wrapper">
          <Header>
            <h1>Goldshish.it (v2)</h1>
          </Header>
          <article>
            <p style={{ textAlign: 'center', fontSize: '26px' }}>
              Work in progress...
            </p>
            <button onClick={isAuthenticated ? logOut : logIn}>
              {isAuthenticated ? 'Log Out' : 'Log In'}
            </button>
            {isAuthenticated && <p>{currentUser.email}</p>}
          </article>
        </div>
      </Page>
    </>
  )
}

const Header = styled('div', {
  boxShadow: '0 2px 5px rgb(0 0 0 / 12%)',
  backgroundColor: '#f44336',
  color: '#fff',
  fontSize: '18px',
  fontFamily: 'Montserrat,sans-serif',
  overflow: 'hidden',
  width: '100%',
  margin: 0,
  padding: '20px',
})

const Page = styled('div', {
  position: 'fixed',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  background: '#fff',
  zIndex: 10,
})
export default HomePage
