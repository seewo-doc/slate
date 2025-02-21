import React, { useState, useCallback, useMemo } from 'react'
import { Slate, Editable, withReact } from '@seewo-doc/slate-react'
import { Text, Descendant, createEditor } from 'slate'
import { css } from '@emotion/css'
import { withHistory } from 'slate-history'

import { Icon, Toolbar } from '../components'

const SearchHighlightingExample = () => {
  const [search, setSearch] = useState<string | undefined>()
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const decorate = useCallback(
    ([node, path]) => {
      const ranges = []

      if (search && Text.isText(node)) {
        const { text } = node
        const parts = text.split(search)
        let offset = 0

        parts.forEach((part, i) => {
          if (i !== 0) {
            ranges.push({
              anchor: { path, offset: offset - search.length },
              focus: { path, offset },
              highlight: true,
            })
          }

          offset = offset + part.length + search.length
        })
      }

      return ranges
    },
    [search]
  )

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <div
          className={css`
            position: relative;
          `}
        >
          <Icon
            className={css`
              position: absolute;
              top: 0.3em;
              left: 0.4em;
              color: #ccc;
            `}
          >
            search
          </Icon>
          <input
            type="search"
            placeholder="Search the text..."
            onChange={e => setSearch(e.target.value)}
            className={css`
              padding-left: 2.5em;
              width: 100%;
            `}
          />
        </div>
      </Toolbar>
      <Editable decorate={decorate} renderLeaf={props => <Leaf {...props} />} />
    </Slate>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  return (
    <span
      {...attributes}
      {...(leaf.highlight && { 'data-cy': 'search-highlighted' })}
      className={css`
        font-weight: ${leaf.bold && 'bold'};
        background-color: ${leaf.highlight && '#ffeeba'};
      `}
    >
      {children}
    </span>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This is editable text that you can search. As you search, it looks for matching strings of text, and adds ',
      },
      { text: 'decorations', bold: true },
      { text: ' to them in realtime.' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out for yourself by typing in the search box above!' },
    ],
  },
]

export default SearchHighlightingExample
