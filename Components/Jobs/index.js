import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import EmploymentList from '../EmploymentList'
import SalaryRangeList from '../SalaryRangeList'
import Job from '../Job'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  isLoading: 'IS_LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    employmentType: [],
    minimumPackage: '',
    search: '',
    jobsList: [],
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  onClickSalaryEl = salaryRange => {
    this.setState({minimumPackage: salaryRange}, this.getJobs)
  }

  onChangeCheckbox = (isChecked, emloymentId) => {
    if (isChecked === true) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, emloymentId],
        }),
        this.getJobs,
      )
    } else {
      const {employmentType} = this.state
      const updatedEmploymentType = employmentType.filter(
        eachItem => eachItem !== emloymentId,
      )
      this.setState({employmentType: updatedEmploymentType}, this.getJobs)
    }
  }

  onChangeSearchInput = event => {
    this.setState({search: event.target.value})
  }

  onClickSearchIcon = () => {
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.isLoading})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.isLoading})
    const {employmentType, minimumPackage, search} = this.state
    const employementString = employmentType.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employementString}&minimum_package=${minimumPackage}&search=${search}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingProfile = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessProfile = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-bg-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderFailureProfile = () => (
    <div className="profile-failure-container">
      <button className="header-btn" type="button" onClick={this.getProfile}>
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.isLoading:
        return this.renderLoadingProfile()
      case apiStatusConstants.success:
        return this.renderSuccessProfile()
      case apiStatusConstants.failure:
        return this.renderFailureProfile()
      default:
        return null
    }
  }

  renderLoadingJobs = () => (
    <div className="loader-container-jobs" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderNoJobs = () => (
    <div className="loader-container-jobs">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="failure-view-image"
      />
      <h1 className="failure-view-heading">No Jobs Found</h1>
      <p className="failure-view-para">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderSuccessJobs = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderNoJobs()
    }
    return (
      <ul className="jobs-ul-container">
        {jobsList.map(eachItem => (
          <Job jobDetails={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderFailureJobs = () => (
    <div className="loader-container-jobs">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="header-btn" type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.isLoading:
        return this.renderLoadingJobs()
      case apiStatusConstants.success:
        return this.renderSuccessJobs()
      case apiStatusConstants.failure:
        return this.renderFailureJobs()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-btm-sec-container">
          <div className="jobs-btm-sec-first-container">
            {this.renderProfile()}
            <hr className="jobs-hr" />
            <h1 className="label-heading">Type of Employment</h1>
            <ul className="jobs-unordered-list">
              {employmentTypesList.map(eachItem => (
                <EmploymentList
                  key={eachItem.employmentTypeId}
                  employmentDetails={eachItem}
                  onChangeCheckbox={this.onChangeCheckbox}
                />
              ))}
            </ul>
            <hr className="jobs-hr" />
            <h1 className="label-heading">Salary Range</h1>
            <ul className="jobs-unordered-list">
              {salaryRangesList.map(eachItem => (
                <SalaryRangeList
                  key={eachItem.salaryRangeId}
                  salaryDetails={eachItem}
                  onClickSalaryEl={this.onClickSalaryEl}
                />
              ))}
            </ul>
          </div>
          <div className="jobs-btm-sec-second-container">
            <div className="input-search-btn-container">
              <input
                type="search"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                className="jobs-input-el"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchIcon}
                className="jobs-search-btn"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
