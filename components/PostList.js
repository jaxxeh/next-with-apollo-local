import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'
import PostUpvoter from './PostUpvoter'

export const allPostsQuery = gql`
  query allPosts($first: Int!, $skip: Int!) {
    allPosts(orderBy: createdAt_DESC, first: $first, skip: $skip) {
      id
      title
      votes
      url
      createdAt
    }
    _allPostsMeta {
      count
    }
    filters @client
  }
`

export const allPostsQueryVars = {
  skip: 0,
  first: 10,
}

const onChangeFilter = (client, key, currentFilters) => event => {
  let filters
  if (event.target.checked) {
    filters = [...currentFilters, key]
  } else {
    filters = currentFilters.filter(e => e !== key)
  }
  client.writeData({ data: { filters } })
}

export default function PostList() {
  const allFilters = ['A', 'B', 'C', 'D']
  return (
    <Query query={allPostsQuery} variables={allPostsQueryVars} ssr={false}>
      {({
        loading,
        error,
        data: { allPosts, _allPostsMeta, filters },
        fetchMore,
      }) => {
        if (error) return <ErrorMessage message="Error loading posts." />
        if (loading) return <div>Loading</div>

        const areMorePosts = allPosts.length < _allPostsMeta.count
        return (
          <React.Fragment>
            <section>
              {allFilters.map((key, index) => (
                <input
                  key={index}
                  type="checkbox"
                  name={key}
                  value={key}
                  checked={filters.includes(key)}
                  onChange={onChangeFilter(client, key, filters)}
                />
              ))}
            </section>
            <section>
              <ul>
                {allPosts.map((post, index) => (
                  <li key={post.id}>
                    <div>
                      <span>{index + 1}. </span>
                      <a href={post.url}>{post.title}</a>
                      <PostUpvoter id={post.id} votes={post.votes} />
                    </div>
                  </li>
                ))}
              </ul>
              {areMorePosts ? (
                <button onClick={() => loadMorePosts(allPosts, fetchMore)}>
                  {' '}
                  {loading ? 'Loading...' : 'Show More'}{' '}
                </button>
              ) : (
                ''
              )}
              <style jsx>{`
                section {
                  padding-bottom: 20px;
                }
                li {
                  display: block;
                  margin-bottom: 10px;
                }
                div {
                  align-items: center;
                  display: flex;
                }
                a {
                  font-size: 14px;
                  margin-right: 10px;
                  text-decoration: none;
                  padding-bottom: 0;
                  border: 0;
                }
                span {
                  font-size: 14px;
                  margin-right: 5px;
                }
                ul {
                  margin: 0;
                  padding: 0;
                }
                button:before {
                  align-self: center;
                  border-style: solid;
                  border-width: 6px 4px 0 4px;
                  border-color: #ffffff transparent transparent transparent;
                  content: '';
                  height: 0;
                  margin-right: 5px;
                  width: 0;
                }
              `}</style>
            </section>
          </React.Fragment>
        )
      }}
    </Query>
  )
}

function loadMorePosts(allPosts, fetchMore) {
  fetchMore({
    variables: {
      skip: allPosts.length,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return previousResult
      }
      return Object.assign({}, previousResult, {
        // Append the new posts results to the old one
        allPosts: [...previousResult.allPosts, ...fetchMoreResult.allPosts],
      })
    },
  })
}
