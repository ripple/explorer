import { RenderResult } from '@testing-library/react'

// Helper to extract container from RenderResult or use directly if already an HTMLElement/Element
const getContainer = (input: HTMLElement | Element | RenderResult): Element => {
  // Check for RenderResult
  if (
    'container' in input &&
    (input as RenderResult).container instanceof HTMLElement
  ) {
    return (input as RenderResult).container
  }
  return input as Element
}

// For class-based selectors (e.g., '.channel'), the class is on .value element
// For data-testid selectors, the testid is on the .row element
const isClassSelector = (selector: string) => selector.indexOf('.') === 0

// Find value element by class - handles cases where .value has multiple classes
const findValueByClass = (
  container: Element,
  className: string,
): Element | null => {
  // className is like '.channel' - we look for .value elements that also have that class
  const classWithoutDot = className.slice(1)
  const valueElements = container.querySelectorAll('.value')
  for (const el of Array.from(valueElements)) {
    if (el.classList.contains(classWithoutDot)) {
      return el
    }
  }
  return null
}

export const expectSimpleRowLabel = (
  input: HTMLElement | Element | RenderResult,
  key: string,
  text: string,
) => {
  const container = getContainer(input)
  if (isClassSelector(key)) {
    // Class is on .value, find the parent .row and then .label
    const valueElement = findValueByClass(container, key)
    const rowElement = valueElement?.closest('.row')
    expect(rowElement?.querySelector('.label')).toHaveTextContent(text)
  } else {
    expect(
      container.querySelector(`[data-testid="${key}"] .label`),
    ).toHaveTextContent(text)
  }
}

export const expectSimpleRowText = (
  input: HTMLElement | Element | RenderResult,
  key: string,
  text: string,
) => {
  const container = getContainer(input)
  if (isClassSelector(key)) {
    // Class is on .value element itself
    expect(findValueByClass(container, key)).toHaveTextContent(text)
  } else {
    expect(
      container.querySelector(`[data-testid="${key}"] .value`),
    ).toHaveTextContent(text)
  }
}

export const expectSimpleRowNotToExist = (
  input: HTMLElement | Element | RenderResult,
  key: string,
) => {
  const container = getContainer(input)
  if (isClassSelector(key)) {
    expect(findValueByClass(container, key)).not.toBeInTheDocument()
  } else {
    expect(
      container.querySelector(`[data-testid="${key}"]`),
    ).not.toBeInTheDocument()
  }
}
