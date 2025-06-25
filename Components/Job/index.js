import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Job = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="link-el-container">
      <li className="job-list-item-container">
        <div className="logo-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="company-title">{title}</h1>
            <div className="star-rating-container">
              <FaStar className="star-icon" />
              <p className="rating-para">{rating}</p>
            </div>
          </div>
        </div>
        <div className="react-icons-text-container">
          <div className="xyz">
            <div className="react-icon-text-container">
              <MdLocationOn className="react-icon" />
              <p className="jid-location-para">{location}</p>
            </div>
            <div className="react-icon-text-container">
              <BsBriefcaseFill className="react-icon" />
              <p className="jid-location-para">{employmentType}</p>
            </div>
          </div>
          <p className="jid-package-para">{packagePerAnnum}</p>
        </div>
        <hr className="job-hr" />
        <h1 className="sjc-description-heading">Description</h1>
        <p className="sjc-description-para">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default Job
