import { mount } from '@vue/test-utils';
import Pill from './Pill.vue';

describe('Pill.vue', () => {
  it('renders the pill text', () => {
    const wrapper = mount(Pill, {
      props: {
        text: 'Test Pill',
      },
    });
    expect(wrapper.text()).toBe('Test Pill');
  });

  it('renders the pill with pulse', () => {
    const wrapper = mount(Pill, {
      props: {
        text: 'Test Pill',
        pulse: true,
      },
    });
    expect(wrapper.classes()).toContain('pill--pulse');
  });

  it('renders the pill with link', () => {
    const wrapper = mount(Pill, {
      props: {
        text: 'Test Pill',
        link: 'https://example.com',
      },
    });
    expect(wrapper.find('a').exists()).toBe(true);
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(Pill, {
      props: {
        text: 'Test Pill',
      },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('emits click event when link is clicked', async () => {
    const wrapper = mount(Pill, {
      props: {
        text: 'Test Pill',
        link: 'https://example.com',
      },
    });
    await wrapper.find('a').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});